import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { League, LeagueDocument } from '../../domain/schemas/leagues.schema';
import { BetRules } from '../../domain/schemas/competitions.schema';

@Injectable()
export class LeaguesMongoose extends MongooseRepository<
  League,
  LeagueDocument
> {
  constructor(
    @InjectModel(League.name)
    model: Model<LeagueDocument>
  ) {
    super(model);
  }

  async getLastId(): Promise<number> {
    const last = await this.model
      .findOne({}, { id: 1 })
      .sort({ id: -1 })
      .limit(1);

    if (!last) return 0;

    return last.id;
  }

  async getById(id: number): Promise<League> {
    const result = await this.model
      .findOne({ id })
      .select({ id: 1, name: 1, rules: 1, userIds: 1, idUserAdm: 1 })
      .lean()
      .exec();
    return result;
  }

  async getByUserId(idUser: number): Promise<League[]> {
    const result = await this.model
      .find({
        userIds: {
          $in: [Number(idUser)]
        }
      })
      .select({ id: 1, name: 1, idUserAdm: 1, userIds: 1, rules: 1 })
      .lean()
      .exec();
    return result;
  }

  async getByUserAdm(id: number): Promise<League[]> {
    const result = await this.model.find({ idUserAdm: id });
    return result;
  }

  async updateAddUser(id: number, userIds: number[]): Promise<League> {
    const result = await this.model.findOneAndUpdate(
      { id },
      {
        $push: {
          userIds: {
            $each: userIds
          }
        }
      }
    );
    return result;
  }

  async updateRules(id: number, rules: BetRules): Promise<League> {
    const result = await this.model.findOneAndUpdate(
      { id },
      {
        $set: {
          rules
        }
      }
    );
    return result;
  }

  async updateRemoveUser(id: number, userIds: number[]): Promise<League> {
    const result = await this.model.findOneAndUpdate(
      { id },
      {
        $pull: { userIds: { $in: userIds } }
      }
    );
    return result;
  }
}
