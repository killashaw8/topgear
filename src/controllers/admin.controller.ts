import { NextFunction, Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { AdminRequest, ExtendedRequest, LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import MemberService from "../models/Member.service";
import { MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";

const memberService = new MemberService();
const adminController: T = {};

adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (err) {
    res.redirect("/admin");
  }
}

adminController.getSignup = (req: Request, res: Response) => {
  try{
    console.log("getSignup")
    res.render("signup");
  }catch (err) {
    res.redirect("/admin");
  }
};

adminController.processSignup = async (req: AdminRequest, res: Response) => {
  try{
    console.log("processSignup");
    const file = req.file;
    if(!file) 
        throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG)


    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, '/');
    newMember.memberType = MemberType.ADMIN;
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function() {
        res.redirect("/admin/product/all");
    });
  }catch (err) {
    console.log("Error, processSignup:", err);
    const message = 
        err instanceof Errors ? err.message: Message.SOMETHING_WENT_WRONG
    res.send(`<script> alert ("${message}"); window.location.replace('/admin/signup') </script>`);
  }
};

adminController.getLogin = (req: Request, res: Response) => {
  try{
    console.log("getLogin")
    res.render("login");
  }catch (err) {
    console.log("Error, getLogin:", err);
    res.redirect("/admin");
  }
};

adminController.processLogin = async (req: AdminRequest, res: Response) => {
  try{
    console.log("processLogin");
    const input: LoginInput = req.body,
      result = await memberService.processLogin(input);

    req.session.member = result;
    req.session.save(function() {
      res.redirect("/admin/product/all");
    });
  }catch (err) {
    console.log("Error, processLogin:", err);
    const message = 
      err instanceof Errors ? err.message: Message.SOMETHING_WENT_WRONG
    res.send(`<script> alert ("${message}"); window.location.replace('/admin/login') </script>`);
  }
};

adminController.logout = async (req: AdminRequest, res: Response) => {
  try{
    console.log("logout");
    req.session.destroy(function() {
      res.redirect("/admin");
    })
  }catch (err) {
    console.log("Error, logout:", err);
    res.redirect("/admin");
  }
};

adminController.getUsers = async (req: Request, res: Response) => {
  try{
    console.log("getUsers")
    const result = await memberService.getUsers();
    console.log("result:", result);

    res.render("users", {users: result});
  }catch (err) {
    console.log("Error, getUsers:", err);
    res.redirect("/admin/login");
  }
};

adminController.getMyPage = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getMyPage");
    const result = await memberService.getMemberDetail(req.member);
    res.render("my", {member: result});
  } catch (err) {
    console.log("Error, getMyPage:", err);
    res.redirect("/admin/login");
  }
};

adminController.verifyMyPassword = async (req: AdminRequest, res: Response) => {
  try {
    const oldPassword = String(req.body.oldPassword || "").trim();
    if (!oldPassword) return res.json({ok: false});

    const member = await memberService.getMemberWithPasswordById(req.member._id);
    if (!member?.memberPassword) return res.json({ok: false});

    const isMatch = await bcrypt.compare(oldPassword, member.memberPassword);
    return res.json({ok: isMatch});
  } catch (err) {
    console.log("Error, verifyMyPassword:", err);
    return res.json({ok: false});
  }
};

adminController.updateMyPage = async (req: AdminRequest, res: Response) => {
  try {
    console.log("updateMyPage");
    const oldPassword = String(req.body.oldPassword || "").trim();
    const newPassword = String(req.body.memberPassword || "").trim();
    const confirmPassword = String(req.body.confirmPassword || "").trim();

    if (newPassword || confirmPassword) {
      if (!oldPassword) {
        return res.send(`<script> alert ("Old password is required"); window.location.replace('/admin/me') </script>`);
      }
      if (newPassword !== confirmPassword) {
        return res.send(`<script> alert ("Password confirmation does not match"); window.location.replace('/admin/me') </script>`);
      }

      const memberWithPassword = await memberService.getMemberWithPasswordById(req.member._id);
      if (!memberWithPassword?.memberPassword) {
        return res.send(`<script> alert ("Old password is incorrect"); window.location.replace('/admin/me') </script>`);
      }

      const isMatch = await bcrypt.compare(oldPassword, memberWithPassword.memberPassword);
      if (!isMatch) {
        return res.send(`<script> alert ("Old password is incorrect"); window.location.replace('/admin/me') </script>`);
      }
    }

    const input: MemberUpdateInput = {
      _id: req.member._id,
      memberNick: req.body.memberNick,
      memberPhone: req.body.memberPhone,
      memberEmail: req.body.memberEmail,
    };

    if (newPassword.length > 0) {
      const salt = await bcrypt.genSalt();
      input.memberPassword = await bcrypt.hash(newPassword, salt);
    }

    const result = await memberService.updateMyProfile(req.member, input);
    req.session.member = result;
    req.session.save(function() {
      res.send(`<script> alert ("Profile updated"); window.location.replace('/admin/me') </script>`);
    });
  } catch (err) {
    console.log("Error, updateMyPage:", err);
    const message = err instanceof Errors ? err.message : Message.UPDATE_FAILED;
    res.send(`<script> alert ("${message}"); window.location.replace('/admin/me') </script>`);
  }
};

adminController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser")
    const result = await memberService.updateChosenUser(req.body);
    res.status(HttpCode.OK).json({data:result});
  } catch (err) {
    console.log("Error, updateChosenUser:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

adminController.checkAuthSession = async (req: AdminRequest, res: Response) => {
  try{
    console.log("checkAuthSession");
    if(req.session?.member) res.send(`<script> alert ("${req.session.member.memberNick}") </script>`);
    else res.send(`<script> alert ("${Message.NOT_AUTHENTICATED}") </script>`);
  }catch (err) {
    console.log("Error, processLogin:", err);
    res.send(err);
  }
};

adminController.verifyAdmin = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
      if(req.session?.member?.memberType === MemberType.ADMIN) {
        req.member = req.session.member;
        next();
      } else {
        const message = Message.NOT_AUTHENTICATED
        res.send(`<script> alert ("${message}"); window.location.replace('/admin/login') </script>`);
      }
    }; 

export default adminController;
