from pydantic import BaseModel

class BaseSchema(BaseModel):

    def clean_dict(self) -> dict:
        return {k: v for k, v in self.__dict__.items() if v is not None}
    
    model_config = {
        "from_attributes": True
    }