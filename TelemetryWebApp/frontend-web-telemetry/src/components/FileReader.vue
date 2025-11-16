<template>
  <div class="left-5 text-red-400 w-1/5 justify-start">
    <label class="text-red-100 p-4">
      <input type="file" id="input" name="input" accept=".csv" @change="loadTextFromFile" class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-red-100 file:text-red-400
      hover:file:bg-red-200
      hover:file:ease-linear">
    </label>
  </div>
</template>

<script setup lang="ts">
import papaparse, { type ParseResult } from 'papaparse';
import { useFileStoreStore, type TelemetryField } from '../stores/FileStore';

type CsvRow = Record<string, unknown>;

const store = useFileStoreStore();

type StoreField = TelemetryField;

const COLUMN_MAP: Record<StoreField, string[]> = {
  Time: ['Time'],
  LatAcc: ['GPS LatAcc'],
  LongAcc: ['GPS LonAcc'],
  GPSSpeed: ['GPS Speed'],
  GPSXPos: ['GPS Latitude'],
  GPSYPos: ['GPS Longitude'],
  EngineRPM: ['EngineSpeed'],
  ThrottlePosition: ['ThrottlePosition'],
  FrBrakePressure: ['BrkPrsF'],
  FuelPressure: ['FuelPressure'],
  OilPressure: ['OilPressure'],
  OilTemp: ['OilTemperature'],
  ExternalVoltage: ['External Voltage'],
  MAP: ['MAP'],
  MAT: ['AirTemp'],
  SteeringAngle: ['SteeringPot'],
  GearPos: ['GearPosition'],
  Lambda: ['Lambda 001'],
  CoolantTemp: ['CoolantTemp']
};


const STORE_FIELDS: StoreField[] = [
  'Time',
  'LatAcc',
  'LongAcc',
  'GPSSpeed',
  'GPSXPos',
  'GPSYPos',
  'EngineRPM',
  'ThrottlePosition',
  'FrBrakePressure',
  'FuelPressure',
  'OilPressure',
  'OilTemp',
  'ExternalVoltage',
  'MAP',
  'MAT',
  'SteeringAngle',
  'GearPos',
  'Lambda',
  'CoolantTemp'
];

const clearStoreData = () => {
  store.clearCollectedData();
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const collectColumn = (rows: CsvRow[], keys: string[]): number[] => {
  if (!keys.length) {
    return [];
  }

  const results: number[] = [];

  for (const row of rows) {
    if (!row || typeof row !== 'object') {
      continue;
    }

    let value: unknown;

    for (const key of keys) {
      if (key in row) {
        value = (row as Record<string, unknown>)[key];
        break;
      }
    }

    const numericValue = toNumber(value);

    if (numericValue !== null) {
      results.push(numericValue);
    }
  }

  return results;
};

const buildPayloadFromRows = (rows: CsvRow[]) => {
  const payloadEntries = STORE_FIELDS.map((field) => [field, collectColumn(rows, COLUMN_MAP[field])] as const);
  return Object.fromEntries(payloadEntries) as Record<StoreField, number[]>;
};

const handleParseResult = (result: ParseResult<CsvRow>) => {
  const rows = result.data.filter((row) => row && typeof row === 'object' && Object.keys(row).length > 0);

  if (!rows.length) {
    console.warn('No usable rows found in CSV file.');
    clearStoreData();
    return;
  }

  const payload = buildPayloadFromRows(rows);
  store.updateCollectedData(payload);
};

function loadTextFromFile(ev: Event) {
  const input = ev.target as HTMLInputElement | null;
  const file = input?.files?.[0];

  if (!file) {
    return;
  }

  clearStoreData();

  const reader = new FileReader();

  reader.onload = (loadEvent) => {
    const text = loadEvent.target?.result;

    if (typeof text !== 'string') {
      console.warn('Unable to read CSV file contents.');
      clearStoreData();
      return;
    }
    
    const lines = text.replace(/\r\n/g, '\n').split('\n');

    // The header is on line 15 (index 14)
    const headerLine = lines[14];
    // The data starts on line 18 (index 17)
    const dataLines = lines.slice(17);

    // Combine the header with the data lines to create a clean CSV string
    const cleanCsvText = [headerLine, ...dataLines].join('\n');

    const parseResult = papaparse.parse<CsvRow>(cleanCsvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    if (parseResult.errors.length) {
      console.warn('CSV parse errors encountered:', parseResult.errors);
    }

    console.log(`CSV file loaded: ${file.name}`);

    handleParseResult(parseResult);
  };

  reader.readAsText(file);
}

</script>