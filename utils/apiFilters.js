class APIFilters{
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryObj = {...this.queryStr};

        const removeFields = ['sort', 'fields', 'q', 'limit', 'page'];
        removeFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-postingDate');
        }
        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    Pagination() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    searchByQuery() {
        if (this.queryStr.q) {
            const query = this.queryStr.q.split('-').join(' ');
            this.query = this.query.find({$text: {$search: "\"" + query + "\""}});
        }
        return this;
    }
}

module.exports = APIFilters;