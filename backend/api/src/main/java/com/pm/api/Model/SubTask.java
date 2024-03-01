package com.pm.api.Model;

import java.sql.Date;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "sub_tasks")
public class SubTask {

    @Id
    private ObjectId id;
    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
    private Status status;
    private int progress;
    private Priority priority;

    @DocumentReference
    private User student;

}
