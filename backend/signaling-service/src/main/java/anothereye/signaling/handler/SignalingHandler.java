package anothereye.signaling.handler;


import anothereye.signaling.dto.SignalMessageDto;
import anothereye.signaling.dto.SignalMessageType;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class SignalingHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // streamerId -> streamer session
    private final Map<String, WebSocketSession> streamerSessions = new HashMap<>();

    // viewer session -> streamerId
    private final Map<String, String> viewerMapping = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("connected: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        SignalMessageDto payload = objectMapper.readValue(message.getPayload(), SignalMessageDto.class);

        SignalMessageType type = payload.getType();

        switch (type) {
            case REGISTER_STREAMER -> {
                String streamerId = payload.getStreamerId();
                streamerSessions.put(streamerId, session);
                log.info("✅ streamer registered: {}, sessionId={}", streamerId, session.getId());
            }

            case JOIN_STREAM -> {
                String targetStreamer = payload.getStreamerId();
                viewerMapping.put(session.getId(), targetStreamer);

                WebSocketSession streamerSession = streamerSessions.get(targetStreamer);
                if (streamerSession != null) {
                    streamerSession.sendMessage(
                            new TextMessage(objectMapper.writeValueAsString(payload))
                    );
                }
            }

            case CHAT -> {
                String streamerId = viewerMapping.get(session.getId());
                WebSocketSession targetSession = streamerSessions.get(streamerId);

                if (targetSession != null) {
                    targetSession.sendMessage(
                            new TextMessage(objectMapper.writeValueAsString(payload))
                    );
                }
            }

            case OFFER -> {
                log.info("webrtc signaling message received: type={}, payload={}", type, payload);
            }

            case ANSWER -> {
                log.info("webrtc signaling message received: type={}, payload={}", type, payload);
            }

            case CANDIDATE -> {
                log.info("webrtc signaling message received: type={}, payload={}", type, payload);
            }

            default -> log.warn("unsupported message type: {}", type);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("disconnected: {}", session.getId());

        viewerMapping.remove(session.getId());
        streamerSessions.entrySet()
                .removeIf(entry -> entry.getValue().getId().equals(session.getId()));
    }
}
