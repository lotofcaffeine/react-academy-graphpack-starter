import data from './data';
const resolvers = {
  Query: {
    hello: () => `Hello World!`,
    users: (obj, args, context, info) =>
      args.limit ? data.users.slice(0, args.limit) : data.users,
    article: (obj, args, context, info) =>
      data.articles.filter((item) => item.id.localeCompare(args.id))[0],
    user: (obj, args, context, info) =>
      data.users.filter((item) => item.id.localeCompare(args.id))[0],
    articles: (obj, args, context, info) =>
      args.searchText
        ? data.articles.filter((item) =>
            item.title
              .toLocaleLowerCase()
              .includes(args.searchText.toLocaleLowerCase())
          )
        : data.articles,
  },
  User: {
    articles: (user, args, context, info) => {
      console.log(user);
      return data.articles.filter((item) =>
        item.authorId.localeCompare(user.id)
      );
    },
  },
  Article: {
    author: (article, args, context, info) => {
      console.log(article);
      return data.users.filter((item) =>
        item.id.localeCompare(article.authorId)
      )[0];
    },
  },
};

export default resolvers;
