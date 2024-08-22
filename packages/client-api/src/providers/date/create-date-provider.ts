import { DateTime } from 'luxon';
import { type Owner, onCleanup, runWithOwner } from 'solid-js';
import { createStore } from 'solid-js/store';

import type { ProviderType } from '../provider-type.model';

export interface DateProviderConfig {
  type: ProviderType.DATE;

  refresh_interval: number;

  /**
   * Either a UTC offset (eg. `UTC+8`) or an IANA timezone (eg.
   * `America/New_York`). Affects the output of `toFormat()`.
   *
   * A full list of available IANA timezones can be found [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).
   */
  timezone?: string;

  /**
   * An ISO-639-1 locale, which is either a 2-letter language code (eg. `en`) or
   * 4-letter language + country code (eg. `en-gb`). Affects the output of
   * `toFormat()`.
   *
   * A full list of ISO-639-1 locales can be found [here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Table).
   */
  locale?: string;
}

export interface DateVariables {
  /**
   * Current date/time as a JavaScript `Date` object. Uses `new Date()` under
   * the hood.
   **/
  new: Date;

  /**
   * Current date/time as milliseconds since epoch. Uses `Date.now()` under the
   * hood.
   **/
  now: number;

  /**
   * Current date/time as an ISO-8601 string (eg.
   * `2017-04-22T20:47:05.335-04:00`). Uses `date.toISOString()` under the hood.
   **/
  iso: string;
}

export async function createDateProvider(
  config: DateProviderConfig,
  owner: Owner,
) {
  const [dateVariables, setDateVariables] =
    createStore<DateVariables>(getDateVariables());

  const interval = setInterval(
    () => setDateVariables(getDateVariables()),
    config.refresh_interval,
  );

  runWithOwner(owner, () => {
    onCleanup(() => clearInterval(interval));
  });

  function getDateVariables() {
    const date = new Date();

    return {
      new: date,
      now: date.getTime(),
      iso: date.toISOString(),
    };
  }

  function toFormat(now: number, format: string) {
    const dateTime = DateTime.fromMillis(now);

    if (config.timezone) {
      dateTime.setZone(config.timezone);
    }

    return dateTime.toFormat(format, { locale: config.locale });
  }

  return {
    get new() {
      return dateVariables.new;
    },
    get now() {
      return dateVariables.now;
    },
    get iso() {
      return dateVariables.iso;
    },
    toFormat,
  };
}
