const ProjectAnalytic = require("../models/project-analytic");
const ViewdProject = require("../models/viewed-project");
const analyticAggregation = async (req, res) => {
    try {

        // const analytics = await ProjectAnalytic.aggregate([
        //     {
        //         $group: {
        //             _id: "$project_id",
        //             totalNDAs: { $sum: "$NDA_signs" },
        //             totalviews: { $sum: "$views" },
        //             totalsaves: { $sum: "$saves" },
        //             totalclicks: { $sum: "$clicks" }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "viewed-projects",
        //             localField: "_id",
        //             foreignField: "project_id",
        //             as: "viewDetails"
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             projectId: "$_id",
        //             totalNDAs: 1,
        //             totalviews: 1,
        //             totalclicks: 1,
        //             totalsaves: 1,
        //             ViewdProjectId: "$viewDetails.project_id",
        //             directLink: "$viewDetails.is_direct_link",
        //             isSearched: "$viewDetails.is_searched",
        //             isDetails: "$viewDetails.is_mobile",
        //             isTablet: "$viewDetails.is_tablet",
        //             isDesktop: "$viewDetails.is_desktop",
        //             isDeleted: "$viewDetails.is_deleted"
        //         }
        //     },
        //     {
        //         $addFields: {
        //             desktop: {
        //                 $map: {
        //                     input: "$isDesktop",
        //                     as: "item",
        //                     in: {
        //                         $cond: {
        //                             if: {
        //                                 $eq: ["$$item", true]
        //                             },
        //                             then: 1,
        //                             else: 0
        //                         }
        //                     }
        //                 }
        //             },
        //             tablet: {
        //                 $map: {
        //                     input: "$isTablet",
        //                     as: "item",
        //                     in: {
        //                         $cond: {
        //                             if: {
        //                                 $eq: ["$$item", true]
        //                             },
        //                             then: 1,
        //                             else: 0
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $unwind: "$desktop",
        //         $unwind: "$tablet"
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 pid: "$projectId"
        //             },
        //             desktopCount: { $sum: "$desktop" },
        //             tabletCount: { $sum: "$tablet" }
        //         }
        //     }
        // ])

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
                $unwind: {
                    path: "$viewDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    totalClicks: { $first: "$totalclicks" },
                    totalNdas: { $first: "$totalNDAs" },
                    totalSaves: { $first: "$totalsaves" },
                    totalViews: { $first: "$totalviews" },
                    desktopCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ["$viewDetails.is_desktop", true]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    tabletCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ["$viewDetails.is_tablet", true]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    mobileCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ["$viewDetails.is_mobile", true]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    searchCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ["$viewDetails.is_searched", true]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    directLink: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ["$viewDetails.is_direct_link", true]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    projectId: "$_id",
                    totalNdas: 1,
                    totalViews: 1,
                    totalSaves: 1,
                    totalClicks: 1,
                    desktopCount: 1,
                    tabletCount: 1,
                    mobileCount: 1,
                    searchCount: 1,
                    directLink: 1
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