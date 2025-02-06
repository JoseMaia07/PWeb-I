class usersDAO {
    // métodos para CRUD
    // CREATE
    static async insertUser(client, doc) {
        const ok = await client
        .insertOne(doc)
        try {
            return ok
        } catch(err) {
            console.log(err)
        }
    }
    // READ
    static async getUsers(client) {
        const cursor = await client
        .find()
        .project({_id:0})
        .sort({nome:1})
        .limit(7)
        try {
            const results = await cursor.toArray()
            return results
        } catch(err) {
            console.log(err)
        }
    }
    // UPDATE
    static async updateNameByEmail(client, email, nome) {
        const docs = await client
        .updateOne(email, nome)
        try {
            return docs
        } catch(err) {
            console.log(err)
        }
    }
    static async updatePasswordByEmail(client, email, senha) {
        const docs = await client.updateOne(email, senha);
        try {
          return docs;
        } catch (err) {
          console.log(err);
        }
    }
    // DELETE
    static async deleteUserByNome(client, nome) {
        const ok = await client
        .deleteOne(nome)
        try {
            return ok
        } catch(err) {
            console.log(err)
        }
    }
}

module.exports = usersDAO