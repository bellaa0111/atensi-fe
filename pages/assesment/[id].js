import {
    Box,
    Divider,
    Flex, Text,
    Textarea,
    Button,
    FormControl,
    RadioGroup,
    Radio,
    Stack,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalFooter,
    useDisclosure,
    Alert,
    AlertDescription,
    AlertTitle,
    AlertIcon,
    useMediaQuery
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import ErrorIcon from '@atlaskit/icon/glyph/error'
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { isSuccess } from "../../api"
import axios from "axios";

const AssesmentPage = () => {
    const router = useRouter()
    const [isMobile] = useMediaQuery("(max-width:768px)")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [triggerAlert, setTriggerAlert] = useState(false)
    const [questions, setQuestions] = useState([])
    const {
        isOpen: isOpenBackModal,
        onOpen: onOpenBackModal,
        onClose: onCloseBackModal } = useDisclosure()

    const {
        isOpen: isOpenSubmit,
        onOpen: onOpenSubmit,
        onClose: onCloseSubmit } = useDisclosure()

    const { query: queryParams } = useRouter();

    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const onSubmit = data => {
        let finalData = []
        questions.map((el, idx) => {
            const jawaban = parseInt(data[el?.id]) || data[el?.id]
            finalData.push({
                "id_pertanyaan": el.id,
                "jawaban": jawaban,
                "kompetensi": el.kompetensi_pertanyaan
            })
        })
        setIsSubmitted(true)
        axios.put(`https://atensi-be.vercel.app/api/penilaian/${queryParams?.id}/`, {
            "id_penilai": JSON.parse(sessionStorage?.getItem("userData"))?.id,
            "value": finalData
        }).then((res) => {
            if (isSuccess(res.status)) {
                setTimeout(() => router.push("/home"), 2000)
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isLoggedIn = sessionStorage?.getItem("isLoggedIn") || false
            if (!isLoggedIn) {
                router.push("/")
            } else if (queryParams?.name === undefined) {
                router.push("/home")
            } else {
                axios.get(`https://atensi-be.vercel.app/api/pertanyaan/${queryParams?.id}`).then((res) => {
                    if (isSuccess(res.status)) {
                        setQuestions(res?.data?.data?.rows)
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        }
    }, [])

    useEffect(() => {
        if (triggerAlert) {
            setTimeout(() => setTriggerAlert(false), 2000)
        }

    }, [triggerAlert])


    return (
        <Layout hasNavbar pb={{ base: "", md: "22px" }}>
            {triggerAlert &&
                <Alert id="alert" left="50%" transform="translateX(-50%)" zIndex="overlay" className="show-alert"
                    p="8px" gap="10px" h="56px"
                    status={isSubmitted ? "success" : "error"} position="fixed"
                    bottom="20px" maxW="336px">
                    <AlertIcon />
                    <AlertTitle
                        fontSize="16px"
                        fontWeight={700}
                        lineHeight={1.5}
                    >
                        {isSubmitted ? "Success!" : "Failed!"}
                    </AlertTitle>
                    <AlertDescription
                        fontSize="16px"
                        fontWeight={500}
                        lineHeight={1.5}>
                        {isSubmitted ? "Penilaian terkumpul." : "Penilaian tidak terkumpul."}
                    </AlertDescription>
                </Alert>
            }
            <Flex
                justify="space-between"
                bgColor="#FFFFFF"
                color="#000000"
                mt={{ base: "", md: "42px", lg: "28px" }}
                px={{ base: "16px", md: "32px" }}
                py={{ base: "28px", md: "36px" }}
                mx={{ md: "36px", lg: "auto" }}
                borderRadius={{ base: "", md: "20px" }}
                maxW="952px"
            >
                <Box>
                    <Text
                        fontWeight="700"
                        fontSize="20px"
                        lineHeight={1.5}
                    >
                        Penilaian Akhir Jabatan
                    </Text>
                    <Box
                        fontSize={{ base: "14px", md: "16px" }}
                        fontWeight={{ base: 400, md: 500 }}
                        lineHeight="24px"
                        mt={{ base: "14px", md: "20px" }}
                    >
                        <Text>
                            {`Nama: ${queryParams.name}`}
                        </Text>
                        <Text>
                            {`Jabatan: ${queryParams.role}`}
                        </Text>
                        <Text>
                            {`Biro/Departemen: ${queryParams.division}`}
                        </Text>
                    </Box>
                </Box>
                <Button
                    backgroundColor="#ffffff"
                    color="#50AEC7"
                    fontSize={{ base: "14px", md: "18px" }}
                    lineHeight={1.5}
                    fontWeight={700}
                    border="1px solid #50AEC7"
                    p={{ md: "", lg: "0px 24px" }}
                    borderRadius="6px"
                    mt="16px"
                    onClick={onOpenBackModal}
                    transform={{ base: "translateY(-15px)", md: "" }}
                >
                    Kembali
                </Button>
            </Flex>
            <form onSubmit={handleSubmit(onSubmit)} id="assesmentForm">
                <FormControl key="assesmentForm" isInvalid={false}>
                    {questions.map((el, index) => {
                        return (
                            <Box
                                maxW="952px"
                                key={index}
                                bgColor="#FFFFFF"
                                color="#000000"
                                mt={{ base: "", md: "8px" }}
                                pt="16px"
                                pb="24px"
                                px={{ base: "16px", md: "33px" }}
                                mx={{ md: "36px", lg: "auto" }}
                                borderRadius={{ base: "", md: "20px" }}>
                                <Text fontWeight={700} fontSize="16px" lineHeight={1.5}>
                                    {`${index + 1}. ${el.pertanyaan}`}
                                </Text>
                                {el.jenis_pertanyaan === "LIKERT" ?
                                    <Flex mt={{ base: "14px", md: "24px" }} ml={{ base: "", sm: "12px" }} mr={{ base: "12px", md: "" }} w={{ base: "100%", sm: "85%", md: "80%", lg: "75%" }} direction="row" justify="space-between" align="end">
                                        <Text
                                            fontSize={{ base: "12px", sm: "16px" }}
                                            lineHeight={1.5}
                                            fontWeight={500}
                                            textAlign="center"
                                        >
                                            Sangat Tidak <br hidden={!isMobile}></br> Setuju
                                        </Text>
                                        <RadioGroup>
                                            <Stack direction="row" spacing={{ base: "12px", md: "40px" }}>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Text fontSize={{ base: "12px", sm: "14px" }} lineHeight={1.5} fontWeight={500}>1</Text>
                                                    <Radio {...register(`${el.id}`, { required: true })}
                                                        name={`${el.id}`}
                                                        isInvalid={errors[el.id]?.message === ''}
                                                        mt="3px" size={{ base: "md", sm: "lg" }} value='1' _checked={{
                                                            bg: "#000000",
                                                            padding: "5px",
                                                            border: "1.5px solid #000000"
                                                        }}>
                                                    </Radio>
                                                </Flex>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Text fontSize={{ base: "12px", sm: "14px" }} lineHeight={1.5} fontWeight={500}>2</Text>
                                                    <Radio {...register(`${el.id}`, { required: true })}
                                                        name={`${el.id}`}
                                                        isInvalid={errors[el.id]?.message === ''}
                                                        mt="3px" size={{ base: "md", sm: "lg" }} value='2' _checked={{
                                                            bg: "#000000",
                                                            padding: "5px",
                                                            border: "1.5px solid #000000"
                                                        }}></Radio>
                                                </Flex>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Text fontSize={{ base: "12px", sm: "14px" }} lineHeight={1.5} fontWeight={500}>3</Text>
                                                    <Radio {...register(`${el.id}`, { required: true })}
                                                        name={`${el.id}`}
                                                        isInvalid={errors[el.id]?.message === ''}
                                                        mt="3px" size={{ base: "md", sm: "lg" }} value='3' _checked={{
                                                            bg: "#000000",
                                                            padding: "5px",
                                                            border: "1.5px solid #000000"
                                                        }}></Radio>
                                                </Flex>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Text fontSize={{ base: "12px", sm: "14px" }} lineHeight={1.5} fontWeight={500}>4</Text>
                                                    <Radio {...register(`${el.id}`, { required: true })}
                                                        name={`${el.id}`}
                                                        isInvalid={errors[el.id]?.message === ''}
                                                        mt="3px" size={{ base: "md", sm: "lg" }} value='4' _checked={{
                                                            bg: "#000000",
                                                            padding: "5px",
                                                            border: "1.5px solid #000000"
                                                        }}></Radio>
                                                </Flex>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Text fontSize={{ base: "12px", sm: "14px" }} lineHeight={1.5} fontWeight={500}>5</Text>
                                                    <Radio {...register(`${el.id}`, { required: true })}
                                                        name={`${el.id}`}
                                                        isInvalid={errors[el.id]?.message === ''}
                                                        mt="3px" size={{ base: "md", sm: "lg" }} value='5' _checked={{
                                                            bg: "#000000",
                                                            padding: "5px",
                                                            border: "1.5px solid #000000"
                                                        }}></Radio>
                                                </Flex>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Text fontSize={{ base: "12px", sm: "14px" }} lineHeight={1.5} fontWeight={500}>6</Text>
                                                    <Radio {...register(`${el.id}`, { required: true })}
                                                        name={`${el.id}`}
                                                        isInvalid={errors[el.id]?.message === ''}
                                                        mt="3px" size={{ base: "md", sm: "lg" }} value='6' _checked={{
                                                            bg: "#000000",
                                                            padding: "5px",
                                                            border: "1.5px solid #000000"
                                                        }}></Radio>
                                                </Flex>
                                            </Stack>
                                        </RadioGroup>
                                        <Text
                                            fontSize={{ base: "12px", sm: "16px" }}
                                            lineHeight={1.5}
                                            fontWeight={500}
                                            textAlign="center"
                                        >
                                            Sangat <br hidden={!isMobile}></br> Setuju
                                        </Text>
                                    </Flex> :
                                    <Box w={{ base: "90%", md: "100%" }}>
                                        <Textarea
                                            isInvalid={errors[el.id]?.message === ''}
                                            mt={{ base: "14px", md: "24px" }} ml="12px"
                                            {...register(`${el.id}`, { required: true })}
                                            placeholder="Jawab di sini"
                                            size="lg"
                                            minW="100%"
                                            display="block"
                                            fontSize={{ base: "14px", md: "16px" }}
                                        />
                                    </Box>
                                }
                            </Box>
                        )
                    })}
                </FormControl>
            </form>
            <Flex
                maxW="952px"
                mx={{ base: "", md: "36px", lg: "auto" }}
                direction="column"
                bgColor="#FFFFFF"
                color="#000000"
                mt={{ base: "", md: "8px" }}
                py="24px"
                borderRadius={{ base: "", md: "20px" }}
                alignItems="center">
                <Button
                    bgColor={"#50AEC7"}
                    _hover={{ backgroundColor: "blue.600" }}
                    color={"#FFFFFF"}
                    p={{ base: "0px 16px", md: "0px 24px" }}
                    borderRadius="6px"
                    mt="15px"
                    h="48px"
                    type="submit"
                    fontSize={{ base: "16px", md: "18px" }}
                    lineHeight={1.5}
                    fontWeight="700"
                    w="fit-content"
                    m="0 auto"
                    onClick={onOpenSubmit}
                >
                    Kumpulkan Penilaian
                </Button>
                {Object.keys(errors).length !== 0 &&
                    <Flex
                        color="red.400"
                        align="center"
                        fontSize="12px"
                        fontWeight="500"
                        lineHeight={1.5}
                        mt="4px">
                        <ErrorIcon />
                        Anda harus mengisi semua pertanyaan
                    </Flex>
                }

                <Divider mt="24px" />
                <Text
                    fontWeight={400}
                    fontSize={{ base: "14px", md: "20px" }}
                    lineHeight="24px"
                    mt="20px"
                    mx={{ base: "16px", md: "auto" }}
                    textAlign="center"
                >
                    Bidang Pengembangan Organisasi BEM Fakultas Psikologi UI
                </Text>
            </Flex>
            <Modal size={{ base: "xs", md: "md" }} isOpen={isOpenBackModal} onClose={onCloseBackModal}>
                <ModalOverlay />
                <ModalContent position="absolute" top="30%">
                    <ModalHeader>Kembali ke Home</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Anda yakin ingin keluar dari laman penilaian?
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            mr="12px"
                            bgColor={"#50AEC7"}
                            color={"#FFFFFF"}
                            p="0px 16px"
                            borderRadius="6px"
                            fontSize="16px"
                            lineHeight={1.5}
                            fontWeight={700}
                            _hover={{ backgroundColor: "blue.600" }}
                            onClick={() => router.push("/home")}
                        >
                            Keluar
                        </Button>
                        <Button
                            onClick={onCloseBackModal}
                            bgColor={"#EDF2F7"}
                            color={"#000000"}
                            p="0px 16px"
                            borderRadius="6px"
                            fontSize="16px"
                            lineHeight={1.5}
                            fontWeight={700}
                            _hover={{ backgroundColor: "gray.300" }}
                        >
                            Lanjutkan Penilaian
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal size={{ base: "xs", md: "md" }} isOpen={isOpenSubmit} onClose={onCloseSubmit}>
                <ModalOverlay />
                <ModalContent position="absolute" top="30%">
                    <ModalHeader>Kumpulkan Penilaian</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Anda yakin ingin kumpulkan penilaian sekarang?
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            mr="12px"
                            bgColor={"#50AEC7"}
                            color={"#FFFFFF"}
                            p="0px 16px"
                            borderRadius="6px"
                            fontSize="16px"
                            lineHeight={1.5}
                            fontWeight={700}
                            _hover={{ backgroundColor: "blue.600" }}
                            type="submit"
                            form="assesmentForm"
                            onClick={() => { setTriggerAlert(true); onCloseSubmit() }}
                        >
                            Kumpulkan
                        </Button>
                        <Button
                            onClick={onCloseSubmit}
                            bgColor={"#EDF2F7"}
                            color={"#000000"}
                            p="0px 16px"
                            borderRadius="6px"
                            fontSize="16px"
                            lineHeight={1.5}
                            fontWeight={700}
                            _hover={{ backgroundColor: "gray.300" }}
                        >
                            Kembali
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Layout >
    )
}
export default AssesmentPage