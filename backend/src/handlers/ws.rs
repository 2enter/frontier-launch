use crate::state::AppState;
use axum::extract::ws::{Message, WebSocket};
use axum::extract::{State, WebSocketUpgrade};
use axum::response::Response;
use futures::{SinkExt, StreamExt};
use model::ws_msg::WSMsg;
use serde::Deserialize;
use tokio::sync::broadcast::Sender;

pub async fn ws_handler(ws: WebSocketUpgrade, State(app_state): State<AppState>) -> Response {
    ws.on_upgrade(move |socket| handle_socket(socket, app_state))
}

#[derive(Deserialize)]
struct PopulationWsData {
    r#type: String,
    amount: u32,
}

#[derive(Deserialize)]
struct PopulationWsMsg {
    data: PopulationWsData,
}

async fn handle_socket(socket: WebSocket, state: AppState) {
    let (mut sender, mut receiver) = socket.split();
    let mut rx = state.ws_sender.subscribe();

    // Spawn a task to forward broadcast messages to the WebSocket
    tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            if sender.send(message.into()).await.is_err() {
                break; // Stop if the WebSocket connection is closed
            }
        }
    });

    while let Some(Ok(msg)) = receiver.next().await {
        tracing::info!("received websocket message: {msg:?}");
        if let Message::Text(text) = msg {
            if let Ok(value) = serde_json::from_str::<PopulationWsMsg>(text.to_string().as_str()) {
                if value.data.r#type == "population" {
                    ws_broadcast(WSMsg::population(value.data.amount), &state.ws_sender);
                }
            }
        }
    }
}

pub fn ws_broadcast(msg: String, sender: &Sender<String>) {
    tracing::info!("broadcasting websocket message: {msg:?}");
    let _ = sender.send(msg);
}
