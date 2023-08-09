export type APIResponse<Data = void> =
	| {
			success: true;
			message?: string;
			data: Data;
			code: number;
	  }
	| {
			success: false;
			error: string;
			type?: string;
			code: number;
			data?: unknown;
	  };

export type Recognition = {
	id: number;
	team_id: string;
	team_name: string;
	message: string;
	value: string | null;
	img: string | null;
	date_posted: Date | null;
	giver_alias: string;
	receiver_names: string[];
};

export type APIFailureResponse = Extract<APIResponse, { success: false }>;

export type AsyncAPIResponse<Data = void> = Promise<APIResponse<Data>>;
