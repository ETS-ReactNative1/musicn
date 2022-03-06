const supabase = require("../utils/db");
const tableName = "public_user_view";

const PublicUserView = {

    getAllUsers: async () => {

        let {
            data: users,
            error
        } = await supabase.from(tableName).select("*")

        if (error) {
            throw error
        } else {
            return users
        }

    },

    getUserByUserID: async (userid) => {
        let {
            data: users,
            error
        } = await supabase.from("user_view").select("*").eq("user_id", userid)

        if (error) {
            throw error
        } else {
            return users
        }

    },

    getUserByUsername: async (username) => {

        let {
            data: users,
            error
        } = await supabase.from(tableName).select("*").eq("username", username)

        if (error) {
            throw error
        } else {
            return users
        }

    },

    getUserByEmail: async (email) => {

    let {
        data: users,
        error
    } = await supabase.from(tableName).select("*").like('email', email)

    if (error) {
        throw error
    } else {
        return users
    }

    }
}

module.exports = PublicUserView