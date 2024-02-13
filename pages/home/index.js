import Layout from "../../components/Layout";
import {
  Box,
  Button,
  Text,
  Flex,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import threeStars from "../../public/three-stars.svg";
import logoutLogo from "../../public/logout-logo.svg";
import { useState, useEffect } from "react";
import { isSuccess } from "../../api";
import axios from "axios";

const Homepage = () => {
  const [userData, setUserData] = useState(null);
  const [allStaffs, setAllStaffs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isDesktop] = useMediaQuery("(min-width: 1024px)");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = sessionStorage?.getItem("isLoggedIn") || false;
      if (isLoggedIn) {
        setUserData(JSON.parse(sessionStorage?.getItem("userData")));
        const id = JSON.parse(sessionStorage?.getItem("userData"))?.id;
        axios
          .get(`https://atensi-be.vercel.app/api/penilaian/${id}/menilai`)
          .then((res) => {
            if (isSuccess(res.status)) {
              setAllStaffs(res?.data?.data);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        router.push("/");
      }
    }
  }, []);

  return (
    <Layout hasNavbar pb={{ base: "", md: "40px", lg: "28px" }}>
      <Flex
        flexDirection='column'
        justify='center'
        bgColor='#FFFFFF'
        color='#000000'
        mt={{ base: "", md: "36px", lg: "28px" }}
        mx={{ base: "", md: "53px", lg: "80px" }}
        px={{ base: "16px", md: "27px", lg: "32px" }}
        borderRadius={{ base: "", md: "20px" }}
      >
        <Flex justify='space-between' align='center'>
          <Box>
            <Text
              fontSize={{ base: "20px", md: "28px", lg: "36px" }}
              lineHeight={1.4}
              fontWeight={700}
              mt={{ base: "26px", md: "36px" }}
            >
              {userData ? `Halo, ${userData?.name}` : ""}
            </Text>
            <Box
              backgroundColor='#FCEEB6'
              p='4px 13px'
              w='fit-content'
              borderRadius='100px'
              mt='12px'
            >
              <Text
                fontSize={{ base: "14px", md: "20px" }}
                lineHeight='24px'
                fontWeight={400}
              >
                {userData ? `${userData?.jabatan} ${userData?.divisi}` : ""}
              </Text>
            </Box>
          </Box>
          {isMobile ? (
            <Button
              backgroundColor='#ffffff'
              color='#50AEC7'
              fontSize='18px'
              lineHeight={1.5}
              fontWeight={700}
              border='1px solid #50AEC7'
              p='12px'
              borderRadius='6px'
              onClick={onOpen}
            >
              <Image src={logoutLogo} width='24px' height='24px' alt='' />
            </Button>
          ) : (
            <Button
              backgroundColor='#ffffff'
              color='#50AEC7'
              fontSize='18px'
              lineHeight={1.5}
              fontWeight={700}
              border='1px solid #50AEC7'
              p='0px 24px'
              borderRadius='6px'
              onClick={onOpen}
            >
              Log Out
            </Button>
          )}
        </Flex>

        <Text fontSize='20px' mt='32px' lineHeight={1.5} fontWeight={700}>
          Penilaian Akhir Jabatan
        </Text>

        <Box mt='24px'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th
                  fontWeight={700}
                  fontSize={{ base: "12px", sm: "16px" }}
                  lineHeight={1.5}
                  color='#000000'
                >
                  Nama
                </Th>
                {isDesktop && (
                  <Th
                    fontWeight={700}
                    fontSize={{ base: "12px", sm: "16px" }}
                    lineHeight={1.5}
                    color='#000000'
                  >
                    Jabatan
                  </Th>
                )}
                <Th
                  fontWeight={700}
                  fontSize={{ base: "12px", sm: "16px" }}
                  lineHeight={1.5}
                  color='#000000'
                >
                  Biro/Departemen
                </Th>
                {!isMobile && <Th></Th>}
              </Tr>
            </Thead>
            <Tbody key='staffMap'>
              {allStaffs.map((el, index) => {
                return (
                  <Tr key={index}>
                    <Td
                      fontWeight={{ base: 400, md: 400, lg: 500 }}
                      fontSize={"16px"}
                      lineHeight={1.5}
                      color='#000000'
                    >
                      {el?.["user_dinilai"]?.name}
                    </Td>
                    {isDesktop && (
                      <Td
                        fontWeight={{ base: 400, md: 400, lg: 500 }}
                        fontSize={"16px"}
                        lineHeight={1.5}
                        color='#000000'
                      >
                        {el?.["user_dinilai"]?.jabatan}
                      </Td>
                    )}
                    <Td
                      fontWeight={{ base: 400, md: 400, lg: 500 }}
                      fontSize={"16px"}
                      lineHeight={1.5}
                      color='#000000'
                    >
                      {isMobile ? (
                        <Flex justify='space-between' align='center'>
                          <Text>{el?.["user_dinilai"]?.akronim}</Text>
                          <Link
                            href={{
                              pathname: `/assesment/[id]`,
                              query: {
                                name: el?.["user_dinilai"]?.name,
                                role: el?.["user_dinilai"]?.jabatan,
                                division: el?.["user_dinilai"]?.divisi,
                              },
                            }}
                            as={`/assesment/${el?.["user_dinilai"]?.id}`}
                          >
                            <Button
                              bgColor={el.done ? "#8D9B9E" : "#50AEC7"}
                              color={el.done ? "#C6CBCC" : "#FFFFFF"}
                              p='8px'
                              borderRadius='6px'
                              fontSize={"16px"}
                              lineHeight={1.5}
                              fontWeight={700}
                              h='40px'
                              isDisabled={el.done}
                              _hover={
                                !el.done && { backgroundColor: "blue.600" }
                              }
                            >
                              <Image
                                src={threeStars}
                                width={24}
                                height={24}
                                alt=''
                              />
                            </Button>
                          </Link>
                        </Flex>
                      ) : (
                        el?.["user_dinilai"]?.divisi
                      )}
                    </Td>
                    {!isMobile && (
                      <Td isNumeric>
                        <Link
                          href={{
                            pathname: `/assesment/[id]`,
                            query: {
                              name: el?.["user_dinilai"]?.name,
                              role: el?.["user_dinilai"]?.jabatan,
                              division: el?.["user_dinilai"]?.akronim,
                            },
                          }}
                          as={`/assesment/${el?.["user_dinilai"]?.id}`}
                        >
                          <Button
                            bgColor={el.done ? "#8D9B9E" : "#50AEC7"}
                            color={el.done ? "#C6CBCC" : "#FFFFFF"}
                            p='0px 16px'
                            borderRadius='6px'
                            fontSize='16px'
                            lineHeight={1.5}
                            fontWeight={700}
                            h='40px'
                            isDisabled={el.done}
                            _hover={!el.done && { backgroundColor: "blue.600" }}
                          >
                            {el.done ? "Sudah Dinilai" : "Nilai Sekarang"}
                          </Button>
                        </Link>
                      </Td>
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>

        <Divider mt='53px' />
        <Text
          fontWeight={400}
          fontSize={{ base: "14px", md: "20px" }}
          lineHeight='24px'
          my='20px'
          alignSelf='center'
          textAlign='center'
        >
          Bidang Pengembangan Organisasi BEM Fakultas Psikologi UI
        </Text>
      </Flex>
      <Modal
        isOpen={isOpen}
        size={{ base: "xs", md: "md" }}
        mx='16px'
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          position='absolute'
          top={{ base: "30%", md: "40%", lg: "30%" }}
        >
          <ModalHeader>Log Out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Anda yakin ingin keluar dari akun?</ModalBody>
          <ModalFooter>
            <Button
              mr='12px'
              bgColor={"#50AEC7"}
              color={"#FFFFFF"}
              p='0px 16px'
              borderRadius='6px'
              fontSize='16px'
              lineHeight={1.5}
              fontWeight={700}
              _hover={{ backgroundColor: "blue.600" }}
              onClick={() => {
                sessionStorage.clear();
                router.push("/");
              }}
            >
              Keluar
            </Button>
            <Button
              onClick={onClose}
              bgColor={"#EDF2F7"}
              color={"#000000"}
              p='0px 16px'
              borderRadius='6px'
              fontSize='16px'
              lineHeight={1.5}
              fontWeight={700}
              _hover={{ backgroundColor: "gray.300" }}
            >
              Kembali
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};
export default Homepage;
