class CreateAddress {
    constructor({ addressRepository, Fault, requestValidator }) {
        this.addressRepository = addressRepository;
        this.Fault = Fault;
        this.requestValidator = requestValidator;
    }

    async execute(data) {
        const newDoc = await this.addressRepository.create({
            ...data,
        });

        return newDoc;
    }
}

module.exports = CreateAddress;
