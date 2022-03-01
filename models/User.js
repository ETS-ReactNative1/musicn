const supabase = require("../utils/db");

async function getAllUsers() {
    let {
        data: users,
        error
    } = await supabase.from('users').select("*")

    if (error) {
        throw error
    } else {
        return users
    }
}

async function getUserByAppUserID(app_userID) {
    let {
        data: users,
        error
    } = await supabase.from('users').select("*").like('app_userid', app_userID)

    if (error) {
        throw error
    } else {
        return users
    }
}

async function getUserByEmail(email) {

    let {
        data: users,
        error
    } = await supabase.from('users').select("*").like('email', email)

    if (error) {
        throw error
    } else {
        return users
    }
}

async function insertUser({
    email,
    name,
    app_userid,
    spotify_userid,
    country,
    profile_pic_url,
    refresh_token
}) {
    const {
        data,
        error
    } = await supabase.from('users').insert([{
        email: email,
        name: name,
        app_userid: app_userid,
        spotify_userid: spotify_userid,
        country: country,
        profile_pic_url: profile_pic_url,
        refresh_token: refresh_token
    }])

    if (error) {
        throw error
    } else {
        return data
    }
}

module.exports = {
    insertUser,
    getAllUsers,
    getUserByEmail,
    getUserByAppUserID
}