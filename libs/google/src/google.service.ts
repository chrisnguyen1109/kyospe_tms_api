import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  GetDirectionsProps,
  GetDirectionsResponse,
  GetGeocodeResponse,
} from './google.type';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);

  private readonly DIRECTIONS_API = 'directions/json';
  private readonly GEOCODE_API = 'geocode/json';

  constructor(private readonly httpService: HttpService) {}

  async getDirections(props: GetDirectionsProps) {
    const data = await this.httpService.axiosRef.get<GetDirectionsResponse>(
      this.DIRECTIONS_API,
      {
        params: {
          ...this.httpService.axiosRef.defaults,
          ...props,
        },
      },
    );

    const response = data.data;
    this.logger.debug(`[getDirections] Response: ${JSON.stringify(response)}`);

    return response;
  }

  async getGeocode(address: string) {
    const data = await this.httpService.axiosRef.get<GetGeocodeResponse>(
      this.GEOCODE_API,
      {
        params: {
          ...this.httpService.axiosRef.defaults,
          address,
        },
      },
    );

    const response = data.data;
    this.logger.debug(`[getGeocode] Response: ${JSON.stringify(response)}`);

    return response;
  }
}
