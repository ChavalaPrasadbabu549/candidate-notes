import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: "5d",
    });
};

export default generateToken;
