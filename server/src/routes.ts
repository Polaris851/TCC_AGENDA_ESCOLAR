import { FastifyInstance, FastifyRequest } from "fastify"
import { compare, hash } from "bcryptjs"
import { z } from "zod"
import { prisma } from "./lib/prisma"
import dayjs from "dayjs"
import { sign } from "jsonwebtoken"
import { AuthMiddlewares } from "./midllewares/auth"

export async function appRoutes(app: FastifyInstance) {
    app.post("/create", async (request) => {
        const createdUserBody = z.object({
            name: z.string(),
            email: z.string(),
            password: z.string(),
            course: z.enum(["Quimica", "Mecatronica", "Redes"]),
        })
        
        const { name, email, password, course } = createdUserBody.parse(request.body)
        
        const hashPassword = await hash(password, 8)

        await prisma.student.create({
            data: {
                name,
                email,
                password: hashPassword,
                course,
            }
        })
    })

    app.post("/auth", async (request) => {
        const createdAuthBody = z.object({
            email: z.string(),
            password: z.string(),
        })
        
        const { email, password } = createdAuthBody.parse(request.body)
        
        const user = await prisma.student.findUnique({
            where: {
                email,
            }
        })

        if(!user) {
            return {
                error: "Student not found"
            }    
        }

        const isValuePassword = await compare(password, user.password)

        if(!isValuePassword) {
            return {
                error: "Password invalid"
            }
        }

        const token = sign({id: user.id}, "teste", {expiresIn: "1y"})

        const { id, name, course } = user
        
        return { user: { id, name, email, course }, token}
    })
    
    // Create daily homeworks
    app.post("/homeworks", async (request) => {
        AuthMiddlewares(request)
        const createdHomeworkBody = z.object({
            title: z.string(),
        })

        const { title } = createdHomeworkBody.parse(request.body)

        const today = dayjs().startOf("day").toDate()

        await prisma.homework.create({
            data: {
                student_id: request.userId!,
                title,
                created_at: today,
                completed: false,
            }
        })
    })

    // Create weekly activities
    app.post("/weeklyactivities", async (request) => {
        AuthMiddlewares(request)

        const createdActivityBody = z.object({
            title: z.string(),
            description: z.string().optional(),
            weekActivityTimes: z.array(z.object({
                dayOfWeek: z.enum(["Segunda", "Terca", "Quarta", "Quinta", "Sexta"]),
                startTime: z.string(),
                endTime: z.string()
            }))
        })
        
        const { title, description, weekActivityTimes } = createdActivityBody.parse(request.body)
        
        const weekActivitiyEntity = await prisma.weekActivity.create({
            data: {
                student_id: request.userId!,
                title,
                description,
            },
        })

        if (weekActivitiyEntity && "id" in weekActivitiyEntity) {
            const formattedWeekActivityTimes = weekActivityTimes.map((weekActivityTime) => ({
                ...weekActivityTime,
                startTime: hoursAndMinutesToDate(weekActivityTime.startTime),
                endTime: hoursAndMinutesToDate(weekActivityTime.endTime),
                week_activity_id: weekActivitiyEntity.id
            }))
            
            await prisma.timeWeekActivity.createMany({
                data: formattedWeekActivityTimes
            })
        }
    })

    // Create monthly events
    app.post("/monthlyevents", async (request) => {
        AuthMiddlewares(request)

        const createdEventBody = z.object({
            title: z.enum(["Prova", "Seminario", "Trabalho", "Tarefa"]),
            discipline_id: z.string(),
            dueDate: z.string(),
            alertDate: z.string().optional(),
            description: z.string().optional(),
        })

        const { title, discipline_id, dueDate, alertDate, description } = createdEventBody.parse(request.body)

        const parsedDueData = dayjs(dueDate).startOf("day").toDate()
        const parsedAlertData = alertDate ? dayjs(alertDate).startOf("day").toDate() : null

        await prisma.event.create({
            data: {
                student_id: request.userId!,
                title,
                discipline_id,
                dueDate: parsedDueData,
                alertDate: parsedAlertData,
                description,
            },
        })
    })
      
    const hoursAndMinutesToDate = (time: string) => {
        const [hours, minutes] = time.split(":")
        
        const timestamp = new Date()
        if (hours && minutes) {
            timestamp.setHours(parseInt(hours))
            timestamp.setMinutes(parseInt(minutes))
        }

        return timestamp
    }

    // Create disciplines
    app.post("/disciplines", async (request) => {
        AuthMiddlewares(request)

        const createdDisciplineBody = z.object({
            discipline: z.string(),
            field: z.enum(["Matematica", "Naturezas", "Humanas", "Linguagens", "Tecnico"]),
            disciplineTimes: z.array(z.object({
                dayOfWeek: z.enum(["Segunda", "Terca", "Quarta", "Quinta", "Sexta"]),
                startTime: z.string(),
                endTime: z.string()
            }))
        })

        const { discipline, field, disciplineTimes } = createdDisciplineBody.parse(request.body)

        const disciplineEntity = await prisma.discipline.create({
            data: {
                student_id: request.userId!,
                discipline,
                field,
            },
        })
        
        if (disciplineEntity && "id" in disciplineEntity) {
            const formattedDisciplineTimes = disciplineTimes.map((disciplineTime) => ({
                ...disciplineTime,
                startTime: hoursAndMinutesToDate(disciplineTime.startTime),
                endTime: hoursAndMinutesToDate(disciplineTime.endTime),
                discipline_id: disciplineEntity.id
            }))
            
            await prisma.timeDiscipline.createMany({
                data: formattedDisciplineTimes
            })
        }

    })

    // Get all possible and completed tasks of the day
    app.get("/day", async (request) => {
        AuthMiddlewares(request)
        const getDayParams = z.object({
            date: z.coerce.date(),
        })

        const { date } = getDayParams.parse(request.query)

        const parsedData = dayjs(date).startOf('day').toDate()

        const possibleHomeworks = await prisma.homework.findMany({
           where: {
            created_at: {
                equals: parsedData,
            }
           },
           select: {
            id: true,
            title: true,
          },
        })

        const completedHomeworks = await prisma.homework.findMany({
            where: {
             created_at: {
                equals: parsedData,    
             }, 
             completed: true,
            },
            select: {
              id: true,
            },
         })

        return {
            possibleHomeworks,
            completedHomeworks
        }
    })

    app.get("/summary", async (request) => {
        AuthMiddlewares(request)

        const homeworks = await prisma.homework.findMany({
            select: {
                id: true,
                created_at: true,
                completed: true
            }
        })

        const groupedByDay: { [index: string]: { date: string; completed: number; amount: number } } = {}

        homeworks.forEach((homework: any) => {
          const dayKey = homework.created_at.toISOString().split('T')[0]
          
          if (!groupedByDay[dayKey]) {
            groupedByDay[dayKey] = {
              date: dayKey,
              completed: 0,
              amount: 0
            }
          }
        
          if (homework.completed) {
            groupedByDay[dayKey].completed++
          }
          groupedByDay[dayKey].amount++
        })
        
        return Object.values(groupedByDay)
    })

    // Get all events for the current month
    app.get("/events", async (request) => {
        AuthMiddlewares(request)

        const currentMonth = dayjs().month() + 1

        const eventsMonth = await prisma.event.findMany({
            where: {
              dueDate: {
                gte: new Date(dayjs().year(), currentMonth - 1, 1), // Start of the month
                lt: new Date(dayjs().year(), currentMonth, 1), // Start of the next month
              },
            },
            orderBy: {
                dueDate: 'asc', 
            },
            select: {
                id: true,
                title: true,
                discipline_id: true,
                dueDate: true,
            },
        })

        const disciplineIds = eventsMonth.map((event) => event.discipline_id)

        const disciplineTitles = await prisma.discipline.findMany({
            where: {
                id: {
                in: disciplineIds,
                },
            },
            select: {
                id: true,
                discipline: true,
            },
        })

        // Mapping discipline titles to their respective events
        const eventsWithTitles = eventsMonth.map((event) => {
        const title = disciplineTitles.find((discipline) => discipline.id === event.discipline_id)?.discipline
            return {
                ...event,
                disciplineTitle: title,
            }
        })

        return { eventsMonth: eventsWithTitles }
    })

    // get all events that will be shown in the notifications tab
    app.get("/notifications", async (request) => {
        AuthMiddlewares(request)

        const now = new Date()
        now.setHours(0)
        now.setSeconds(0)
        now.setMinutes(0)
        now.setMilliseconds(0)

        const events = await prisma.event.findMany({
            where: {
                OR: [
                    {
                        dueDate: now
                    },
                    {
                        dueDate: {
                            gt: now
                        },
                        alertDate: {
                            lte: now
                        }
                    }
                ]
            },
            select: {
                id: true,
                title: true,
                discipline:true,
                dueDate:true
            }
        })

        return events
    })

    app.get("/week", async (request) => {
        AuthMiddlewares(request)

        const weekActivities = await prisma.weekActivity.findMany({
            select: {
                id: true,
                title: true,
            }
        })

        const weekActivityIds = weekActivities.map((activity: any) => activity.id)

        const weekActivitiesTimes = await prisma.timeWeekActivity.findMany({
            where: {
                week_activity_id: {
                    in: weekActivityIds, 
                },
            },
            select: {
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                week_activity_id: true,
            },
        })

        const weekActivity = weekActivities.map((activity: any) => {
            const matchingTimes = weekActivitiesTimes.filter((time: any) => time.week_activity_id === activity.id)
            return {
              id: activity.id,
              title: activity.title,
              times: matchingTimes.map((time: any) => ({
                dayOfWeek: time.dayOfWeek,
                startTime: time.startTime,
                endTime: time.endTime,
              })),
            }
          })

        const disciplines = await prisma.discipline.findMany({
            select: {
                id: true,
                discipline: true,
            },
            distinct: ['discipline']
        })

        const disciplinesIds = disciplines.map((discipline: any) => discipline.id)

        const disciplinesTimes = await prisma.timeDiscipline.findMany({
            where: {
                discipline_id: {
                    in: disciplinesIds, 
                },
            },
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              discipline_id: true,
            },
        })

        const discipline = disciplines.map((discipline: any) => {
            const matchingTimes = disciplinesTimes.filter((time: any) => time.discipline_id === discipline.id)
            return {
              id: discipline.id,
              discipline: discipline.discipline,
              times: matchingTimes.map((time: any) => ({
                dayOfWeek: time.dayOfWeek,
                startTime: time.startTime,
                endTime: time.endTime,
              })),
            }
          })

        
        return { weekActivity, discipline}

    })

    // Get all student's subjects
    app.get("/discipline", async (request) => {
        AuthMiddlewares(request)

        const disciplines = await prisma.discipline.findMany({
            select: {
                id: true,
                discipline: true,
                field: true,
            },
            distinct: ['discipline']
        })

        return disciplines
    })

    app.get("/discipline/:id", async (request) => {
        AuthMiddlewares(request)

        const getMonthlyEventsParams = z.object({
            id: z.string().uuid(),
        })
        
        const { id } = getMonthlyEventsParams.parse(request.params)

        await prisma.event.findUnique({
            where: {
                id: id
            }
        })
    })

    app.patch("/homeworks/:id/toggle", async (request) => {
        AuthMiddlewares(request)
        const toggleHomeworkParams = z.object({
            id: z.string().uuid(),
        })
        
        const { id } =toggleHomeworkParams.parse(request.params)

        let dayHomework = await prisma.homework.findFirst({
            where: {
                id: id
            }
        })

        if (dayHomework && !dayHomework.completed) {
            await prisma.homework.update({
                where: {
                    id: id,
                },
                data: {
                    completed: true,
                }
            })
        } else {
            await prisma.homework.update({
                where: {
                    id: id,
                },
                data: {
                    completed: false,
                }
            })
        }
    })

    app.delete("/monthlyevents/:id", async (request) => {
        AuthMiddlewares(request)

        const deleteMonthlyEventsParams = z.object({
            id: z.string().uuid(),
        })
        
        const { id } = deleteMonthlyEventsParams.parse(request.params)

        await prisma.event.delete({
            where: {
                id: id
            }
        })
    })
    
    app.delete("/weeklyactivities/:id", async (request) => {
        AuthMiddlewares(request)

        const deleteWeeklyActivitiesParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = deleteWeeklyActivitiesParams.parse(request.params)

        await prisma.timeWeekActivity.deleteMany({
            where: {
                week_activity_id: id,
            }
        })

        await prisma.weekActivity.delete({
            where: {
                id: id
            }
        })
    })

    app.delete("/disciplines/:id", async (request) => {
        AuthMiddlewares(request)

        const deleteDisciplinesParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = deleteDisciplinesParams.parse(request.params)

        await prisma.timeDiscipline.deleteMany({
            where: {
                discipline_id: id,
            }
        })

        await prisma.event.deleteMany({
            where: {
                discipline_id: id,
            }
        })

        await prisma.discipline.delete({
            where: {
                id: id
            }
        })
    })
}