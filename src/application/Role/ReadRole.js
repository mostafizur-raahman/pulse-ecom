class ReadRole {
    constructor({ readFactory, roleRepository }) {
        this.readFactory = readFactory;
        this.roleRepository = roleRepository;
    }

    async execute(props) {
        const reader = this.readFactory.createReader({
            repository: this.roleRepository,
        });

        return await reader.execute(props, [
            {
                $project: this.roleRepository.baseProjection.negative.default,
            },
        ]);
    }
}

module.exports = ReadRole;
