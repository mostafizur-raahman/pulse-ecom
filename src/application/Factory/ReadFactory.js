const { increaseDateByOneDay, toObjectId } = require("../../shared/obj");

class ReadFactory {
    createReader({ repository }) {
        class Reader {
            constructor() {
                this.repository = repository;
            }

            async execute(
                {
                    id,
                    page,
                    limit,
                    search = "",
                    startDate,
                    endDate,
                    status,
                    audience,
                    sortField,
                    sortOrder,
                    userId,
                    role,
                    accountType,
                    createdBy,
                    productId,
                    ids,
                    number,
                },
                aggregateArray
            ) {
                const _page = parseInt(page) || 1;
                const _limit = parseInt(limit) || 10;
                const skip = (_page - 1) * _limit;

                const matchObj = {
                    isDeleted: { $ne: true },
                    ...(id && { _id: toObjectId(id) }),
                    ...(ids && {
                        _id: { $in: ids.map((id) => toObjectId(id)) },
                    }),
                    ...(productId && { productId: toObjectId(productId) }),
                    ...(userId && { userId: toObjectId(userId) }),
                    ...(createdBy && { createdBy: toObjectId(createdBy) }),
                    ...(role && { role: toObjectId(role) }),
                    ...(status && { status }),
                    ...(number && { number }),
                    ...(audience && { audience }),
                    ...(accountType && { accountType }),
                    createdAt: {
                        $gte: startDate ? new Date(startDate) : new Date(0),
                        $lte: endDate
                            ? startDate === endDate
                                ? new Date(increaseDateByOneDay(startDate))
                                : new Date(increaseDateByOneDay(endDate))
                            : new Date(),
                    },
                };

                let matchWithSearch;

                if (search) {
                    search = search && search.trim();

                    matchWithSearch = {
                        $and: [
                            matchObj,
                            {
                                $or: this.repository.constructSearchQuery(
                                    search
                                ),
                            },
                        ],
                    };
                } else {
                    matchWithSearch = matchObj;
                }

                let sortObj = {};

                if (sortField && sortOrder) {
                    sortObj[sortField] = sortOrder === "asc" ? 1 : -1;
                } else {
                    sortObj = { createdAt: -1 };
                }

                console.debug("------------------------------");
                console.group("ReadFactory:", repository.model);
                console.debug("Query", JSON.stringify(matchWithSearch));
                console.debug("Aggregation", JSON.stringify(aggregateArray));
                console.debug("Sort", JSON.stringify(sortObj));
                console.groupEnd();
                console.debug("------------------------------");

                try {
                    const result = await this.repository.aggregate([
                        {
                            $match: matchWithSearch,
                        },
                        ...(aggregateArray || []),
                        {
                            $sort: sortObj,
                        },
                        {
                            $facet: {
                                _docs: [{ $skip: skip }, { $limit: _limit }],
                                totalDocuments: [
                                    {
                                        $group: {
                                            _id: null,
                                            count: { $sum: 1 },
                                        },
                                    },
                                ],
                                totalPages: [
                                    {
                                        $group: {
                                            _id: null,
                                            totalDocuments: { $sum: 1 },
                                        },
                                    },
                                    {
                                        $project: {
                                            totalPages: {
                                                $ceil: {
                                                    $divide: [
                                                        "$totalDocuments",
                                                        _limit,
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ]);

                    return id || number
                        ? result[0]._docs[0]
                        : {
                              docs: result[0]?._docs,
                              totalDocuments:
                                  result[0]?.totalDocuments[0]?.count,
                              totalPages: result[0]?.totalPages[0]?.totalPages,
                              page: _page,
                              limit: _limit,
                          };
                } catch (error) {
                    throw error;
                }
            }
        }

        return new Reader();
    }
}

module.exports = ReadFactory;
