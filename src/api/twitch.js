const { default: axios } = require("axios");
const AppError = require("../errors/AppError");

const twitchAuthClient = axios.create({
  baseURL: "https://id.twitch.tv/oauth2",
});

twitchAuthClient.interceptors.request.use(
  (config) => {
    return {
      ...config,
    };
  },
  (error) => Promise.reject(error)
);

twitchAuthClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error.response?.data);
  }
);

const TwitchAuthApi = {
  getAccessToken: async () => {
    const twitchParams = new URLSearchParams();
    twitchParams.append("client_id", process.env.TWITCH_CLIENT_ID);
    twitchParams.append("client_secret", process.env.TWITCH_SECRET);
    twitchParams.append("grant_type", process.env.TWITCH_GRANT_TYPE);

    try {
      const response = await twitchAuthClient.post("/token", twitchParams);

      return response.data;
    } catch (error) {
      console.log(
        "🚀 ~ file: twitch.js ~ line 37 ~ getAccessToken: ~ error",
        error
      );
    }
  },
};

const twitchClient = axios.create({
  baseURL: "https://api.twitch.tv/helix",
});

twitchClient.interceptors.request.use(
  async (config) => {
    const response = await TwitchAuthApi.getAccessToken();

    return {
      ...config,
      headers: {
        ...config.headers,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
        authorization: `Bearer ${response.access_token}`,
      },
    };
  },
  (error) => Promise.reject(error)
);

twitchClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error.response?.data);
  }
);

const TwitchApi = {
  getUsers: async (userIds) => {
    try {
      const response = await twitchClient.get(`/users`, {
        params: {
          id: userIds,
        },
      });

      return response.data;
    } catch (error) {
      throw new AppError("Failed to get users list.");
    }
  },

  getUsersChannelInformation: async (userIds) => {
    try {
      const response = await twitchClient.get(`/channels`, {
        params: {
          broadcaster_id: userIds,
        },
      });

      return response.data;
    } catch (error) {
      throw new AppError("Failed to get user's channel information");
    }
  },
};

module.exports = { TwitchAuthApi, TwitchApi };
