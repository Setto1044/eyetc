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

    // viewerId -> viewer session
    private final Map<String, WebSocketSession> viewerSessions = new HashMap<>();

    // viewer session -> streamerId
    private final Map<String, String> viewerMapping = new HashMap<>();

    // Viewer SessionID -> Session
    private final Map<String, WebSocketSession> sessions = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("connected: {}", session.getId());
        sessions.put(session.getId(), session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        SignalMessageDto payload = objectMapper.readValue(message.getPayload(), SignalMessageDto.class);

        SignalMessageType type = payload.getType();

        switch (type) {
            case REGISTER_STREAMER -> {
                String streamerId = payload.getStreamerId();
                String streamerSessionId = session.getId();
                streamerSessions.put(streamerId, session);
                log.info("✅ streamer registered: {}, sessionId={}", streamerId, streamerSessionId);
            }

            case JOIN_STREAM -> {
                String streamerId = payload.getStreamerId();
                String viewerSessionId = session.getId();

                viewerMapping.put(viewerSessionId, streamerId);
                viewerSessions.put(viewerSessionId, session);

                log.info("✅ viewer({}) join request to {}", viewerSessionId, streamerId);

                payload.setSender(viewerSessionId);
                WebSocketSession streamerSession = streamerSessions.get(streamerId);
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
                String streamerId = payload.getStreamerId();
                String viewerSessionID = payload.getReceiver();
                String streamerSessionId = streamerSessions.get(streamerId).getId();
                WebSocketSession viewerSession = viewerSessions.get(viewerSessionID);

                log.info("✅ streamer ({}) offered join to {}", streamerId, viewerSessionID);

                payload.setSender(streamerSessionId);
                if (viewerSession != null) {
                    viewerSession.sendMessage(
                            new TextMessage(objectMapper.writeValueAsString(payload))
                    );
                }

            }

            case ANSWER -> {
                String viewerSessionId = session.getId();
                String streamerId = viewerMapping.get(viewerSessionId);
                String streamerSessionId = streamerSessions.get(streamerId).getId();


                log.info("✅ Route Answer from {} to {}", viewerSessionId, streamerId);
                log.info("answer : {}", payload.getMessage());
                payload.setSender(viewerSessionId);
                payload.setReceiver(streamerSessionId);
                payload.setStreamerId(streamerId);

                WebSocketSession streamerSession = streamerSessions.get(streamerId);
                if (streamerSession != null) {
                    streamerSession.sendMessage(
                            new TextMessage(objectMapper.writeValueAsString(payload))
                    );
                }
            }

            case CANDIDATE -> {
                String receiverSessionId = payload.getReceiver();
                payload.setSender(session.getId());

                WebSocketSession receiverSession = sessions.get(receiverSessionId);
                if (receiverSession != null) {
                    receiverSession.sendMessage(
                            new TextMessage(objectMapper.writeValueAsString(payload))
                    );
                }
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
