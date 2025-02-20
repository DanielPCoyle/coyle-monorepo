export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Here you would typically validate the email and password, and check them against your database
        if (email  && password ) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Login failed' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}