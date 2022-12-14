import { Injectable, NotAcceptableException } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { CreateLeagueDTO } from '../../model/dto/leagues/create-league.dto';
import { League } from '../../schemas/leagues.schema';
import { GetRulesService } from '../rules/get-rules.service';
import { CreateUserService } from '../users/create-user.service';
import { LeagueService } from './league.service';

@Injectable()
export class CreateLeagueService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    private readonly getRulesService: GetRulesService,
    protected readonly createUserService: CreateUserService
  ) {
    super(leagueRepository, createUserService);
  }

  async createLeague(league: CreateLeagueDTO): Promise<any> {
    await this.validateUsers(league.userIds);

    const newLeague = new League();
    newLeague.id = (await this.leagueRepository.getLastId()) + 1;
    newLeague.name = league.name;
    newLeague.idCompetition = league.idCompetition;
    newLeague.edition = league.edition;
    newLeague.idUserAdm = 1;
    newLeague.userIds = league.userIds;
    newLeague.rules = await this.getRulesService.getRulesByCompetition(
      league.idCompetition
    );
    await this.leagueRepository.insertOne(newLeague, 'League');
  }
}
