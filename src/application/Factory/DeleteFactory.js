class DeleteFactory {
    createDelete({ repository }) {
        class Delete {
            constructor() {
                this.repository = repository;
            }

            async execute({ ids, customQuery, userId }) {
                try {
                    const result = await this.repository.deleteManyByQuery(
                        {
                            _id: { $in: ids },
                            isDeleted: false,
                            ...customQuery,
                        },
                        { deletedBy: userId }
                    );

                    return result;
                } catch (error) {
                    throw error;
                }
            }

            async executeGeneric(query, userId) {
                try {
                    const result = await this.repository.deleteManyByQuery(
                        query,
                        { deletedBy: userId }
                    );

                    return result;
                } catch (error) {
                    throw error;
                }
            }
        }

        return new Delete();
    }
}

module.exports = DeleteFactory;
