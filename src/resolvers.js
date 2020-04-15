import data from './data';
import randomId from 'uuid/v4';
const filterArticles = (articles, search) => {
  let filtered =
    search.published !== undefined
      ? articles.filter((item) => item.isPublished === search.published)
      : articles;
  console.log('filtered', filtered);
  console.log('search.text', search.text);
  filtered = search.text
    ? filtered.filter((item) =>
        item.title.toLocaleLowerCase().includes(search.text.toLocaleLowerCase())
      )
    : filtered;
  console.log('lastFiltered', filtered);
  return filtered;
};
const resolvers = {
  Query: {
    hello: () => `Hello World!`,
    users: (obj, args, context, info) =>
      args.limit ? data.users.slice(0, args.limit) : data.users,
    article: (obj, args, context, info) =>
      data.articles.filter((item) => item.id.localeCompare(args.id))[0],
    user: (obj, args, context, info) =>
      data.users.filter((item) => item.id.localeCompare(args.id))[0],
    articles: (obj, { search }, context, info) => {
      return filterArticles(data.articles, search);
    },
  },
  User: {
    articles: (user, { search }, context, info) => {
      const filtered = data.articles.filter((item) =>
        item.authorId.localeCompare(user.id)
      );
      return filterArticles(filtered, search);
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
  Mutation: {
    createUser: (parent, { name, email }, context, info) => {
      console.log('email', email);
      // console.log(name, email, data.users);
      let filtered = data.users.find((item) => item.email === email);
      console.log(filtered);
      if (filtered) {
        throw new Error('Email already registered');
      }

      let newUser = {
        id: randomId(),
        name,
        email,
      };
      data.users.push(newUser);
      return newUser;
    },
    publishArticle: (parent, { id }, context, info) => {
      let article = data.articles.find((item) => item.id.localeCompare(id));
      if (!article) {
        throw new Error('Article not found');
      }
      console.log(article);
      if (article.isPublished === 'false') {
        article.isPublished = true;
        return article;
      } else {
        throw new Error('Article is already published');
      }
    },
  },
};

export default resolvers;
