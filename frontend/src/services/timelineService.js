import { apiUrl } from "../config.json";

const urlEndPoint = apiUrl;

const TimelineService = () => {
  getFeeds = () => {
    const requestBody = {
      query: `
          query{
            allPost {
              id
              post
              creatorPostId
            }
          }
        `
    };

    fetch(urlEndPoint, {
      method: "GET",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        return data;
      });
  };
};

export default TimelineService;
