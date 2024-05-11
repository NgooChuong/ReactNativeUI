import axios from "axios";

const BASE_URL = 'http://192.168.1.17:8000/';

export const endpoints = {
    'local': '/local/',
    'picture': '/picture/',
     'transport': '/transports/',
     'tag':'/tags/',
     'report':"/reports/",
     'users': "/users/",
     'allposts':"/allposts/",
     'posts': (post_id) => `/posts/${post_id}/`,
     'comments': (post_id) => `/posts/${post_id}/comments/`,
     'reply': (comment_id) => `/comments/${comment_id}/replies/`,
     'login': '/o/token/',
     'current-user': '/users/current-user/',
     'add-comment': (post_id) => `/posts/${post_id}/comments/`,
     'add-rep': (comment_id) => `/comments/${comment_id}/replies/`,
     'add-tick': (post_id,comment_id) => `/posts/${post_id}/comments/${comment_id}/tick/`,
    'deleteCompanion':  (post_id) => `/posts/${post_id}/travelCompanion/`,
    'report':"/reports/",
    'reportUser': (reportId) => `/reports/${reportId}/userReport/`,
    'user': (id_user) => `/users/${id_user}/`,
    'apiEmail':"/api/send/mail",
};
export const authApi = (accessToken) => axios.create({
    baseURL: BASE_URL,
    headers: {
        "Authorization": `bearer ${accessToken}`
    }
})
export default axios.create({
    baseURL: BASE_URL
});