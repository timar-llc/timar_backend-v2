import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import crypto, { createHash } from 'crypto';
import { HeleketPaymentRequestDto } from './heleket.interface';
import { Injectable } from '@nestjs/common';
import { HeleketPaymentResponseDto } from './heleket.interface';

@Injectable()
export class HeleketService {
  private readonly heleketUrl: string;
  private readonly heleketApiKey: string;
  private readonly heleketMerchantId: string;
  private readonly heleketExchangeRateUrl =
    'https://api.heleket.com/v1/exchange-rate/RUB/list';

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.heleketUrl = this.configService.get('HELEKET_API_URL')!;
    this.heleketApiKey = this.configService.get('HELEKET_API_KEY')!;
    this.heleketMerchantId = this.configService.get('HELEKET_MERCHANT_ID')!;
  }

  async getExchangeRate() {
    const response = await axios.get(this.heleketExchangeRateUrl);
    const exchangeRateArray = response.data.result;
    const exchangeRate = exchangeRateArray.find(
      (rate: any) => rate.from === 'RUB' && rate.to === 'USD',
    );
    return exchangeRate.course;
  }

  async generateHead(data: Record<string, any>) {
    const merchant = this.heleketMerchantId;
    const sign = createHash('md5')
      .update(
        Buffer.from(JSON.stringify(data)).toString('base64') +
          this.heleketApiKey,
      )
      .digest('hex');
    return {
      merchant: merchant,
      sign: sign,
    };
  }

  async createPayment(
    data: HeleketPaymentRequestDto,
  ): Promise<HeleketPaymentResponseDto> {
    const head = await this.generateHead(data);
    const amount = data.amount * (await this.getExchangeRate());
    // const response = await axios.post(
    //   `${this.heleketUrl}/v1/payment`,
    //   {
    //     amount,
    //     currency: data.currency,
    //     order_id: data.orderId,
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       ...head,
    //     },
    //   },
    // );
    // return response.data;

    return {
      state: 200,
      result: {
        uuid: crypto.randomUUID(),
        order_id: data.orderId,
        amount: amount.toString(),
        currency: data.currency,
        comments: 'test',
        merchant_amount: amount.toString(),
        network: 'test',
        address: 'test',
        from: 'test',
        txid: 'test',
        payment_status: 'check',
        url: 'test',
        expired_at: 123,
        status: 'check',
        is_final: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        commission: 'test',
        payer_currency: data.currency,
        address_qr_code: 'test',
      },
    };
  }
}
