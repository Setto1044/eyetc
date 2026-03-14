package anothereye.signaling.dto;

import lombok.*;

@Data
@NoArgsConstructor
@ToString
public class SignalMessageDto {
    private SignalMessageType type;
    private String streamerId;
    private String sender;
    private String message;
}