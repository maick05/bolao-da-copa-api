import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BetsMongoose } from '../../../adapter/repository/rounds/bets.repository';
import { GetBetsDTO } from '../../model/dto/bets/get-bets.dto';
import { Bet } from '../../schemas/rounds.schema';
import { JoinService } from '../join.service';
import { GetLeagueService } from '../leagues/get-league.service';

@Injectable()
export class GetBetsMatchService extends AbstractService {
  constructor(
    protected readonly betsRepository: BetsMongoose,
    protected readonly leagueService: GetLeagueService,
    protected readonly joinService: JoinService
  ) {
    super();
  }

  async getBetsByMatch(betDTO: GetBetsDTO): Promise<Bet[]> {
    const matches = await this.betsRepository.getBetsByMatch(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside
    );

    return this.joinService.joinBets(matches);
  }

  async getBetsByMatchAndLeague(
    betDTO: GetBetsDTO,
    idLeague: number
  ): Promise<Bet[]> {
    await this.leagueService.validateLeague(idLeague);

    const league = await this.leagueService.getLeagueById(idLeague);

    const matches = await this.betsRepository.getBetsByMatchAndLeague(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside,
      league.userIds
    );

    return this.joinService.joinBets(matches);
  }
}
