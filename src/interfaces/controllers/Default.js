class DefaultController {
    async index(req, res) {
        const greetings = await req.container
            .resolve("greet")
            .execute(req.container.resolve("config").APP_NAME, req.originalUrl);

        return res.json(greetings);
    }
}

module.exports = DefaultController;
