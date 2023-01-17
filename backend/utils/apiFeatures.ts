import mongoose from "mongoose";

class apiFeatures {
  public query: mongoose.Query<any, {}>;
  public queryString: any;

  constructor(query: mongoose.Query<any, {}>, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword: any = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i", //case insensitive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };

    // Removing fields from the query
    const removeFields: Array<string> = ["keyword", "limit", "page"];

    removeFields.forEach((el) => delete queryCopy[el]);

    // Advance filter for price, ratings etc

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  /* Pagination */

  pagination(resPerPage: number) {
    const currentPage: number = Number(this.queryString.page) || 1;

    const skip: number = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);

    return this;
  }
}

export default apiFeatures;
