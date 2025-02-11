use crate::state::AppState;
use axum::extract::ws::WebSocket;
use axum::extract::{State, WebSocketUpgrade};
use axum::response::Response;
use futures::{SinkExt, StreamExt};
use tokio::sync::broadcast::Sender;

pub async fn ws_handler(ws: WebSocketUpgrade, State(app_state): State<AppState>) -> Response {
    ws.on_upgrade(move |socket| handle_socket(socket, app_state))
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

    while let Some(Ok(_)) = receiver.next().await {
        // sender.send(msg).await.unwrap();
    }
}

pub fn ws_broadcast(msg: String, sender: &Sender<String>) {
    let _ = sender.send(format!("{msg}"));
}
