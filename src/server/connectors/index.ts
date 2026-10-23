import { anthropic } from "./anthropic";
import { github } from "./github";
import { gworkspace } from "./gworkspace";
import { m365 } from "./m365";
import { netskope } from "./netskope";
import { okta } from "./okta";
import { openai } from "./openai";
import { ramp } from "./ramp";
import type { Connector } from "./types";
import { workday } from "./workday";

export const CONNECTORS: Connector[] = [openai, anthropic, github, m365, okta, gworkspace, netskope, ramp, workday];
export const getConnector = (id: string) => CONNECTORS.find((c) => c.id === id);
export type { Connector };
