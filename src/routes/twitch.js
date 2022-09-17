const { Router } = require("express");

const Database = require("../database/config");
const AppError = require("../errors/AppError");

const { prisma } = require("../database/prismaClient");
const { TwitchApi } = require("../api/twitch");

const EnsureIsAuthenticated = require("../middlewares/EnsureIsAuthenticated");

const twitchRoutes = Router();

const populateUsersAndChannelsTable = async () => {
  const db = await Database();

  const users = await db.all(`SELECT * FROM users`);

  if (!users) {
    throw new AppError("Users not found.");
  }

  const userIds = users.map((user) => user.twitch_id);

  const twitchUser = await TwitchApi.getUsers(userIds);

  // Populate users table with Twitch user data
  await Promise.all(
    twitchUser.data.map(async (twitchUser) => {
      return await db
        .run(
          `UPDATE users SET twitch_name = $twitchName, view_count = $viewCount, profile_image = $profileImage WHERE twitch_id = $twitchId`,
          {
            $twitchName: twitchUser.display_name,
            $viewCount: twitchUser.view_count,
            $profileImage: twitchUser.profile_image_url,
            $twitchId: twitchUser.id,
          }
        )
        .catch((error) => console.log(error));
    })
  );

  const userTwitchChannels = await TwitchApi.getUsersChannelInformation(
    userIds
  );
  const channelsInDb = await prisma.channels.findMany();

  // Populate channels table with Twitch Channel data
  await Promise.all(
    userTwitchChannels.data.map(async (userChannel) => {
      const userId = users.find(
        (user) => user.twitch_id === userChannel.broadcaster_id
      ).id;

      if (channelsInDb.find((channel) => channel.user_id === userId)) {
        return;
      }

      return await prisma.channels.create({
        data: {
          user_id: userId,
          game_name: userChannel.game_name,
          title: userChannel.title,
          language: userChannel.broadcaster_language,
        },
      });
    })
  );

  await db.close();
};

populateUsersAndChannelsTable();

twitchRoutes.get("/streamers", EnsureIsAuthenticated, async (req, res) => {
  const PAGE_SIZE = 10;

  const { page } = req.query;

  if (!page || page < 1) {
    throw new AppError("Page should be greater than zero.");
  }

  const totalCount = await prisma.users.count({
    where: {
      follow_ticket: {
        not: 0,
      },
    },
  });

  // SELECT * FROM users AS u LEFT JOIN channels AS c ON u.id = c.user_id GROUP BY u.id
  const dbUsers = await prisma.users.findMany({
    include: {
      channel: true,
    },
    where: {
      follow_ticket: {
        not: 0,
      },
    },
    orderBy: [
      {
        queue: "asc",
      },
      {
        points: "desc",
      },
      {
        experience: "desc",
      },
      {
        created_at: "asc",
      },
    ],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return res.json({
    data: dbUsers,
    page,
    totalCount,
  });
});

twitchRoutes.patch("/follow/:id", EnsureIsAuthenticated, async (req, res) => {
  const { id } = req.params;

  const user = await prisma.users.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!user) {
    throw new AppError("User not found.");
  }

  const updatedUser = await prisma.users.update({
    where: {
      id: Number(id),
    },
    data: {
      queue:
        user.queue !== 0
          ? {
              decrement: 1,
            }
          : 0,
    },
  });

  delete user.password;

  return res.json(updatedUser);
});

module.exports = { twitchRoutes };
