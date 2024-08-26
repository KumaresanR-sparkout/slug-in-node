const ProjectAnalytic = require("../models/project-analytic");
const ViewdProject = require("../models/viewed-project");
const analyticAggregation = async (req, res) => {
    try {
        // const analytics = await ProjectAnalytic.find({});
        // const analytics = await ViewdProject.find({});
        const analytics = await ProjectAnalytic.aggregate([
            {
                $group: {
                    _id: "$project_id",
                    totalNDAs: { $sum: "$NDA_signs" },
                    totalviews: { $sum: "$views" },
                    totalsaves: { $sum: "$saves" },
                    totalclicks: { $sum: "$clicks" }
                }
            },
            {
                $lookup: {
                    from: "viewed-projects",
                    localField: "_id",
                    foreignField: "project_id",
                    as: "viewDetails"
                }
            },
            {
                $project: {
                    _id: 0,
                    projectId: "$_id",
                    totalNDAs: 1,
                    totalviews: 1,
                    totalclicks: 1,
                    totalsaves: 1,
                    ViewdProjectId: "$viewDetails.project_id",
                    directLink: "$viewDetails.is_direct_link",
                    isSearched: "$viewDetails.is_searched",
                    isDetails: "$viewDetails.is_mobile",
                    isTablet: "$viewDetails.is_tablet",
                    isDesktop: "$viewDetails.is_desktop",
                    isDeleted: "$viewDetails.is_deleted"
                }
            },
            {
                $addFields: {
                    desktop: {
                        $map: {
                            input: "$isDesktop",
                            as: "item",
                            in: {
                                $cond: {
                                    if: {
                                        $eq: ["$$item", true]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
                        }
                    }
                }
            },
            {
                $unwind: "$desktop"
            },
            {
                $group: {
                    _id: {
                        pid: "$projectId"
                    },
                    desktopCount: { $sum: "$desktop" }
                }
            }
        ])

        return res.json(analytics);
    }
    catch (error) {
        console.error("Error occures", error.message);
        return res.json({ message: error.message });
    }
}

module.exports = {
    analyticAggregation
};