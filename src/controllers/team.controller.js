import Team from "../model/Team.js";
import User from "../model/User.js";


export const createTeam = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Team name is required"
            });
        }

        const team = await Team.create({
            name,
            description,
            creator: req.user.id,
            members: [req.user.id],    // FIX HERE
        });

        return res.status(201).json({
            success: true,
            message: "Team created successfully",
            team
        });

    } catch (error) {
        next(error);
    }
};


export const addMember = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const { memberEmail } = req.body;

        // Validate
        if (!memberEmail) {
            return res.status(400).json({
                success: false,
                message: "Member email is required"
            });
        }

        // Find team
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email: memberEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email does not exist"
            });
        }

        // Check if already a member
        if (team.members.includes(user._id)) {
            return res.status(400).json({
                success: false,
                message: "User already a member of this team"
            });
        }

        // Add user to team
        team.members.push(user._id);
        await team.save();

        return res.status(200).json({
            success: true,
            message: "Member added successfully",
            member: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        next(error);
    }

};


export const getMembers = async (req, res, next) => {
    try {
        const { teamId } = req.params;

        // Find team & populate member details
        const team = await Team.findById(teamId).populate("members", "name email");

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        return res.status(200).json({
            success: true,
            members: team.members
        });

    } catch (error) {
        next(error);
    }
};
