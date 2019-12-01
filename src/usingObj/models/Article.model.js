/* eslint-disable linebreak-style */
class Article {
  /**
   * class constructor
   * @param {object} data
   */
  constructor() {
    this.articles = [];
  }

  create(data) {
    const newArticle = {
      title: data.title,
      article: data.article,
      createdOn: Date.now(),
      modifiedOn: Date.now(),
    };
    this.articles.push(newArticle);
    return newArticle;
  }
}

module.exports = new Article();
