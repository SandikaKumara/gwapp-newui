'use server'
import prisma from "@/lib/db"

export const createLogAuditEntry = async (userId = null, status = null, userName = null, remarks = null) => {
    try {
        const result = await prisma.LoginAudit.create({
            data: {
                userId: userId,
                userName: userName,
                status: status,
                remarks: remarks
            }
        })

    } catch (err) {
        console.log(`An error occurred while inserting audit log entry. ${err.message}`);

    }
}


export const getLogAudits = async (searchText) => {
    try {
        const result = await prisma.LoginAudit.findMany({
            where: {
                OR: [
                    {
                        remarks: {
                            contains: searchText
                        }
                    },
                    {
                        userName: {
                            contains: searchText
                        }
                    },
                    {
                        status: {
                            contains: searchText
                        }
                    },
                    {
                        user: {
                            firstName: {
                                contains: searchText
                            }
                        }
                    },
                    {
                        user: {
                            lastName: {
                                contains: searchText
                            }
                        }
                    },

                ]

            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { type: 'success', message: result }
    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching audit log entries. ${err.message}` }
    }
}


function getDateFilter(type) {
    const now = new Date();

    switch (type) {
        case 'A': // All
            return null; // No filter

        case 'H': // Last hour (current time - 60 minutes)
            return new Date(now.getTime() - 60 * 60 * 1000);

        case 'D': // Last 24 hours, grouped by 30-minute intervals
            return new Date(now.getTime() - 24 * 60 * 60 * 1000);

        case '7D': // Last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0); // Start of day for consistency
            return sevenDaysAgo;

        case 'M': // Last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            thirtyDaysAgo.setHours(0, 0, 0, 0);
            return thirtyDaysAgo;

        case '6M': // Last 6 months (starting from 6 months ago)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(now.getMonth() - 6);
            sixMonthsAgo.setDate(1); // Start from the first day of that month
            sixMonthsAgo.setHours(0, 0, 0, 0);
            return sixMonthsAgo;

        case 'Y': // Last 12 months grouped by months
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            oneYearAgo.setMonth(now.getMonth()); // Keep aligned month
            oneYearAgo.setDate(1); // Start of month
            oneYearAgo.setHours(0, 0, 0, 0);
            return oneYearAgo;

        default:
            throw new Error('Invalid filter type');
    }
}




function groupRecords(records, type) {
    const groupBy = (record, formatter) => formatter(new Date(record.createdAt));

    let formatter, generateRange;
    const now = new Date();

    switch (type) {
        case 'H': // Group by last hour, starting from current minute
            formatter = (date) => {
                const minutes = date.getMinutes();
                return `${date.getHours()}:${minutes < 10 ? '0' : ''}${minutes}`;
            };
            generateRange = () => {
                const range = [];
                const now = new Date();
                const currentMinutes = now.getMinutes();
                const currentHour = now.getHours();

                // Generate the last 60 minutes, including the current minute
                for (let i = 0; i < 60; i++) {
                    const date = new Date(now);
                    date.setMinutes(currentMinutes - i);

                    // Adjust the hour if minutes go below 0
                    if (date.getMinutes() < 0) {
                        date.setHours(currentHour - 1);
                        date.setMinutes(60 + date.getMinutes());
                    }

                    range.unshift(
                        `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
                    );
                }

                return range;
            };
            break;

        case 'D': // 30-minute intervals over the last 24 hours
            formatter = (date) => {
                const minutes = Math.floor(date.getMinutes() / 30) * 30;
                return `${date.getHours()}:${minutes < 10 ? '0' : ''}${minutes}`;
            };

            generateRange = () => {
                const range = [];
                const start = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
                start.setMinutes(Math.floor(start.getMinutes() / 30) * 30, 0, 0); // Align to the nearest 30-minute slot
                for (let i = 0; i < 48; i++) { // 48 intervals of 30 minutes
                    const slot = new Date(start.getTime() + i * 30 * 60 * 1000);
                    const hours = slot.getHours();
                    const minutes = slot.getMinutes();
                    range.push(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
                }
                return range;
            };
            break;


        case '7D': // Group by last 7 days
            formatter = (date) => `${date.toLocaleString('default', { month: 'short' })}-${date.getDate()}`;
            generateRange = () => {
                const range = [];
                const start = new Date(now);
                start.setDate(start.getDate() - 7); // Last 7 days including today
                start.setHours(0, 0, 0, 0);
                for (let i = 0; i <= 7; i++) {
                    const date = new Date(start);
                    date.setDate(start.getDate() + i);
                    range.push(formatter(date));
                }
                return range;
            };
            break;

        case 'M': // Group by last 30 days
            formatter = (date) => `${date.toLocaleString('default', { month: 'short' })}-${date.getDate()}`;
            generateRange = () => {
                const range = [];
                const start = new Date(now);
                start.setDate(start.getDate() - 29); // Last 30 days including today
                start.setHours(0, 0, 0, 0);
                for (let i = 0; i < 30; i++) {
                    const date = new Date(start);
                    date.setDate(start.getDate() + i);
                    range.push(formatter(date));
                }
                return range;
            };
            break;

        case '6M': // Group by last 6 months
            formatter = (date) => `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            generateRange = () => {
                const range = [];
                const start = new Date(now);
                start.setMonth(start.getMonth() - 5); // Last 6 months including current
                start.setDate(1);
                for (let i = 0; i < 6; i++) {
                    const date = new Date(start);
                    date.setMonth(start.getMonth() + i);
                    range.push(formatter(date)); // Format using the same formatter as in the records
                }
                return range;
            };
            break;

        case 'Y': // Group by last 12 months
            formatter = (date) => `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            generateRange = () => {
                const range = [];
                const start = new Date(now);
                start.setMonth(start.getMonth() - 11); // Last 12 months including current
                start.setDate(1);
                for (let i = 0; i < 12; i++) {
                    const date = new Date(start);
                    date.setMonth(start.getMonth() + i);
                    range.push(formatter(date)); // Format using the same formatter as in the records
                }
                return range;
            };
            break;

        case 'A': // Group by year and month (all-time)
            formatter = (date) => `${date.getFullYear()}-${date.getMonth() + 1}`;
            generateRange = () => {
                const range = [];
                for (let m = 0; m < 12; m++) {
                    range.push(`${now.getFullYear()}-${m + 1}`);
                }
                return range;
            };
            break;

        default:
            throw new Error('Invalid filter type');
    }

    // Group records into time slots
    const grouped = records.reduce((acc, record) => {
        const key = formatter(new Date(record.createdAt));
        const status = record.status;

        if (!acc[key]) {
            acc[key] = { success: 0, failed: 0, Sessions: 0 };
        }

        acc[key][status] = (acc[key][status] || 0) + 1;
        acc[key].Sessions += 1;
        return acc;
    }, {});

    // Ensure all time slots are included, filling in missing slots with count 0
    return generateRange().map((slot) => ({
        time_unit: slot,
        Success: grouped[slot]?.success || 0,
        Failed: grouped[slot]?.failed || 0,
        Sessions: grouped[slot]?.Sessions || 0,
    }));
}


export const getLogAuditsForDashboard = async (timeFrame) => {
    // Date filters > H>hour, D>Day, 7D>7days, 30D>30days, 60D>60days, 90D>90Days, 180D>180Days, 365D>365 days 
    const filterDate = getDateFilter(timeFrame);

    const whereClause = filterDate
        ? { createdAt: { gte: filterDate } }  // Apply filter if `filterDate` is set
        : {};  // No filter for "A" (All records)


    try {
        const result = await prisma.LoginAudit.findMany({
            where: whereClause
        })

        const rows = groupRecords(result, timeFrame)
        // console.log(rows);


        return { type: 'success', message: rows }
    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching audit log entries. ${err.message}` }
    }
}