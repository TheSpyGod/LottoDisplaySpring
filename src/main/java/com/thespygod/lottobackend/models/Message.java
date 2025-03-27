package com.thespygod.lottobackend.models;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    private String content;

    public String getContent() {
        return this.content;
    }
}

