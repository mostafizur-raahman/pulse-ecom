class Factory {
    constructor({ moduleName }) {
        this.moduleName = moduleName;
    }

    createRead = (props, application, customQuery = {}) => {
        return async (req, res, next) => {
            try {
                const result = await req.container
                    .resolve(application)
                    .execute({
                        id: req.query.id,
                        page: req.query.page,
                        limit: req.query.limit,
                        search: req.query.search,
                        startDate: req.query.startDate,
                        endDate: req.query.endDate,
                        ...props,
                        ...customQuery,
                    });

                if (req.query.id) {
                    if (!result) {
                        return res.status(404).send({
                            message: `${this.moduleName} not found.`,
                        });
                    }
                }

                let responseObj = {
                    message: `${this.moduleName} fetched successfully.`,
                };

                if (req.query.number) {
                    responseObj.doc = result;
                } else if (!req.query.id) {
                    responseObj.docs = result.docs;
                    responseObj.totalPages = result.totalPages;
                    responseObj.totalDocuments = result.totalDocuments;
                    responseObj.page = result.page;
                    responseObj.limit = result.limit;
                } else {
                    responseObj.doc = result;
                }

                res.status(200).send(responseObj);
            } catch (error) {
                next(error);
            }
        };
    };

    createDelete = (operationIds, application) => async (req, res, next) => {
        try {
            // TODO: Validate the operationIds
            // req.container
            //     .resolve("requestValidator")
            //     .isValidObjectId(operationId);

            const status = await req.container.resolve(application).execute({
                ids: operationIds,
                userId: req.user?._id,
            });

            if (status.modifiedCount === 0)
                return res
                    .status(404)
                    .send({ message: `${this.moduleName} not found.` });

            return res.status(200).send({
                message: `${this.moduleName} deleted successfully.`,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = Factory;
