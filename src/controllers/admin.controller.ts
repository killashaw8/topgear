import { Request, Response } from "express";
import Errors, { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import { ExtendedRequest, LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberService from "../models/Member.service";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";

const memberService = new MemberService();
const authService = new AuthService();
const adminController: T = {};

adminController.processSignup = async (req: Request, res: Response) => {
  try{
    console.log("signup");
    const input: MemberInput = req.body,
      file = req.file;
    input.memberImage = file?.path.replace(/\\/g, '/');
    const result = await memberService.processSignup(input),
      token = await authService.createToken(result);

    res.cookie("accessToken", token,
      {
        maxAge: AUTH_TIMER * 3600 * 1000,
        httpOnly: false
      }
    );
    
    res.status(HttpCode.CREATED).json({member: result, accessToken: token});
  } catch(err) {
    console.log("Error, signup:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
}

adminController.processLogin = async (req: Request, res: Response) => {
  try{
    console.log("login");
    const input: LoginInput = req.body,
      result = await memberService.processLogin(input),
      token = await authService.createToken(result);

    res.cookie("accessToken", token,
      {
        maxAge: AUTH_TIMER * 3600 * 1000,
        httpOnly: false
      }
    );

    res.status(HttpCode.OK).json({member: result, token: token});

  } catch(err) {
    console.log("Error, login:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
}

adminController.logout = (req: ExtendedRequest, res: Response) => {
  try{
    console.log("logout");
    res.cookie("accessToken", null, {maxAge: 0, httpOnly: true});
    res.status(HttpCode.OK).json({logout: true});
  } catch(err) {
    console.log("Error, logout:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
}

export default adminController;