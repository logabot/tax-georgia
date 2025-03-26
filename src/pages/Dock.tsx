import React from 'react';
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import info from '../accets/images/info.jpg';

const Dock = () => {
	return (
		<>
			<Typography variant="h1" fontSize={32} fontWeight={900} gutterBottom>Заполнение налоговой декларации</Typography>

			<Typography variant="subtitle1" gutterBottom>
				Форма A
			</Typography>

			<List dense sx={{ mb: 3 }}>
				<ListItem>
					<ListItemText
						primary="Графа 15"
						secondary="Нарастающий итог доходов с начала календарного (налогового) года. Сюда включаются все виды доходов, учитываемые в рамках малого бизнеса, за вычетом доходов, облагаемых по общим правилам (дивиденды, проценты и т. д.)."
					/>
				</ListItem>
				<ListItem>
					<ListItemText
						primary="Графа 18"
						secondary="Доход, полученный через кассовый аппарат (наличные расчёты, подтверждённые кассовым чеком)."
					/>
				</ListItem>
				<ListItem>
					<ListItemText
						primary="Графа 19"
						secondary="Поступления через физический POS-терминал."
					/>
				</ListItem>
				<ListItem>
					<ListItemText
						primary="Графа 20"
						secondary="Доход, полученный на расчётные счета (в том числе банковские переводы)."
					/>
				</ListItem>
				<ListItem>
					<ListItemText
						primary="Графа 21"
						secondary="Все иные формы дохода, с которых налог не был удержан у источника (например, переводы на платёжные системы Payoneer, PayPal, Wise, доходы от операций с криптовалютой по договорам бартера, и т. п.)."
					/>
				</ListItem>
			</List>

			<img src={info} alt="" style={{ maxWidth: "100%" }} />
		</>
	);
};

export default Dock;