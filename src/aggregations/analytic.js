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
                    "viewDetails.project_id": 1,
                    "viewDetails.is_direct_link": 1,
                    "viewDetails.is_searched": 1,
                    "viewDetails.is_mobile": 1,
                    "viewDetails.is_tablet": 1,
                    "viewDetails.is_desktop": 1,
                    "viewDetails.is_deleted": 1
                }
            },
            // {
            //     $group: {
            //         _id: {
            //             pid: "viewDetails.project_id"
            //         }
            //     }
            // }
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