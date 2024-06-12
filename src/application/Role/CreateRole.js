class CreateRole {
    constructor({ roleRepository, Fault, requestValidator }) {
        this.roleRepository = roleRepository;
        this.Fault = Fault;
        this.requestValidator = requestValidator;
    }

    async execute(data) {
        const isRoleExist = await this.roleRepository.existsByQuery({
            name: data.name,
            isDeleted: false,
        });

        if (isRoleExist) {
            throw new this.Fault("Role already exists", 400);
        }

        const newDoc = await this.roleRepository.create({
            ...data,
        });

        return newDoc;
    }
}

module.exports = CreateRole;
