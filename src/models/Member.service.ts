import MemberModel from "../schema/Member.model";
import { MemberInput, Member, LoginInput } from "../libs/types/member";
import * as bcrypt from "bcryptjs";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";




class MemberService {
  private readonly memberModel;
  constructor() {
    this.memberModel = MemberModel
  }

/** ADMIN **/

  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({memberType: MemberType.ADMIN})
      .exec();
    if(exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    try{
      const result = await this.memberModel.create(input);

      result.memberPassword = "";
      return result.toJSON();
    } catch(err) {
      console.error("Error, model:signup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  } 

  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        {memberNick: input.memberNick},
        {memberNick: 1, memberPassword: 1})
      .exec();
    if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    else if(member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );

    if(!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }
    return await this.memberModel.findById(member._id).lean().exec();
  }

  






  
/** USER **/


}

export default MemberService;
