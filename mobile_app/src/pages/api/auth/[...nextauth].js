import NextAuth from "next-auth"

export default async function auth(req, res) {
    const accessToken = req.cookies['accessToken']

    res.send({ accessToken })
    res.end()

}
