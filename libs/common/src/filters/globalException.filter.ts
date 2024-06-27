import { AppConfigService } from '@app/app-config/appConfig.service';
import { I18nPath, I18nTranslations } from '@app/i18n/i18n.type';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import {
  CustomError,
  CustomErrorResponse,
  ErrorCode,
} from '../types/common.type';
import { CustomException } from './exceptions/custom.exception';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter<unknown> {
  private readonly logger = new Logger(GlobalExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly appConfigService: AppConfigService,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    this.loggingError(exception, request);

    const responseBody = this.handleException(exception);

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  private handleException(exception: unknown): CustomErrorResponse {
    if (exception instanceof CustomException) {
      const errors = exception.errors.map(error => ({
        ...error,
        message:
          error.message ??
          this.i18nService.t(<I18nPath>`errorMessage.${error.code}`, {
            args: error.args,
          }),
      }));

      return this.formatErrorResponse(exception.statusCode, errors);
    }

    if (exception instanceof UnauthorizedException) {
      return this.formatErrorResponse(HttpStatus.UNAUTHORIZED, [
        {
          code: ErrorCode.COM_CER001_001,
          message: this.i18nService.t('errorMessage.auth.COM_CER001_001'),
          detail: exception.message,
        },
      ]);
    }

    if (exception instanceof ForbiddenException) {
      return this.formatErrorResponse(HttpStatus.FORBIDDEN, [
        {
          code: ErrorCode.COM_CER001_002,
          message: this.i18nService.t('errorMessage.auth.COM_CER001_002'),
          detail: exception.message,
        },
      ]);
    }

    if (exception instanceof NotFoundException) {
      return this.formatErrorResponse(HttpStatus.NOT_FOUND, [
        {
          code: ErrorCode.COM_COM001_003,
          message: this.i18nService.t('errorMessage.common.COM_COM001_003'),
          detail: exception.message,
        },
      ]);
    }

    return this.formatErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [
      {
        code: ErrorCode.COM_COM001_001,
        message: this.i18nService.t('errorMessage.common.COM_COM001_001'),
        detail: (<Error>exception).message,
      },
    ]);
  }

  private formatErrorResponse(
    statusCode: HttpStatus,
    errors: CustomError[],
  ): CustomErrorResponse {
    const isShowDetail = !this.appConfigService.isProdEnv;

    return {
      statusCode,
      message: 'Error',
      errors: errors.map(error => {
        const [, code] = error.code.split('.');

        return {
          code: <string>code,
          message: error.message,
          detail: isShowDetail ? error.detail : undefined,
        };
      }),
    };
  }

  private loggingError(exception: unknown, request: Request) {
    this.logger.error(
      `💥💥💥 ${request.method} - ${request.url} - ${exception}`,
    );
    console.dir(exception);
  }
}
