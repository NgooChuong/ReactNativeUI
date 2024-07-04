import APIs, { endpoints } from "../../config/APIs";

const getTags= async () => {
    try{
        let res = await APIs.get(endpoints['tag']);
        return res.data;        
    }catch(ex) {
        console.log(ex);
    }
}
export const getPosts= async (id_tag,page) => {
    try {
        let url = `${endpoints['tag_posts'](id_tag)}?&page=${page}`;
        let res = await APIs.get(url);
        return res.data.results;
    } catch(ex) {
        console.error(ex);
    }
  }

  export const getFillPosts= async (id_tag,q,fil,page) => {
    try {
        let url = `${endpoints['tag_posts'](id_tag)}?q=${q}&c=${fil.id_localcome}&a=${fil.id_localarrive}&ti=${fil.time}&r=${fil.id_check}&page=${page}`;
        let res = await APIs.get(url);
        // console.log(res.data)
        return res;
    } catch(ex) {
        console.error(ex);
    }
  }

  export const getUserRoute = async (id_post,page,username,id_come, id_arrive) => {
    try {
        let url = `${endpoints['user_route'](id_post)}?c=${id_come}&a=${id_arrive}&u=${username}&page=${page}`;
        let res = await APIs.get(url);
        // console.log(res.data)
        return res;
    } catch(ex) {
        console.error(ex);
    }
  }
export default getTags;