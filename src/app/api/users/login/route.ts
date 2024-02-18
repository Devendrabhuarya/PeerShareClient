import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'User Not Exist' }, { status: 400 });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: 'password is Incorrect' },
                { status: 400 });
        }
        const tokenData = {
            id: user._id,
            name: user.username,
            email: user.email
        }
        const token = jwt.sign(tokenData,
            process.env.TOKEN_SECRET!,
            { expiresIn: '1d' }
        );
        const response = NextResponse.json({
            message: "Login Successfully",
            success: true,
        });
        response.cookies.set('token', token, {
            httpOnly: true
        });
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error._message }, { status: 500 });
    }
}